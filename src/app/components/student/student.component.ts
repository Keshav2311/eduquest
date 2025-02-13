import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SignService } from '../../services/sign.service';
import { UserInterface } from '../../interfaces/user';
import { Courseinterface } from '../../interfaces/courses';
import { CoursesService } from '../../services/courses.service';
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-student',
  standalone: false,
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {
  instructor$: any[] = [];
  userInfo: UserInterface | undefined;
  luser = JSON.parse(localStorage.getItem('users') || '{}');
  courseslist: String[] = [];
  coursedata: Courseinterface[] = [];
  count: number = 0;

  @ViewChild('feeChart') feeChartRef!: ElementRef;
  @ViewChild('creditsChart') creditsChartRef!: ElementRef;

  constructor(private signService: SignService, private coursesService: CoursesService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.luser && this.luser.id) {
      this.signService.getUserById(this.luser.id).subscribe({
        next: (res) => {
          this.userInfo = res;
          this.courseslist = this.userInfo?.courses || [];
          for (let i = 0; i < this.courseslist.length; i++) {
            this.count++;
          }
          this.fetchCourses();
        },
        error: (err) => {
          console.error('Error fetching user information:', err);
        }
      });
    } else {
      console.error('No user found in local storage');
    }
  }

  fetchCourses(): void {
    debugger; // Execution will pause here

    if (this.courseslist.length > 0) {
      const courseRequests = this.courseslist.map((courseId) =>
        this.coursesService.getcourseById(courseId).toPromise().then(
          (course) => ({ courseId, course }), // Preserve courseId for reference
          () => ({ courseId, course: null }) // Handle errors gracefully
        )
      );
  
      Promise.all(courseRequests)
        .then((courseResults) => {
          debugger; // Execution will pause here

          const validCourses = courseResults
            .filter((entry) => entry.course !== null)
            .map((entry) => entry.course);

            const invalidCourseIds: string[] = courseResults
            .filter((entry) => entry.course === null)
            .map((entry) => entry.courseId.toString());
  
          this.coursedata = validCourses;
          console.log('Fetched courses:', this.coursedata);
          this.cdr.detectChanges();
          this.createCharts();
  
          // If there are missing courses, ask the user if they want to unenroll
          if (invalidCourseIds.length > 0) {
            Swal.fire({
              title: 'Missing Courses',
              text: `The following courses no longer exist: ${invalidCourseIds.join(', ')}. Would you like to unenroll from them?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, Unenroll',
              cancelButtonText: 'No, Keep Them',
            }).then((result) => {
              if (result.isConfirmed) {
                this.unenrollFromMissingCourses(invalidCourseIds);
              }
            });
          }
        })
        .catch((err) => {
          console.error('Error fetching courses:', err);
        });
    } else {
      console.log('No courses found for the user.');
    }
  }
  
  // ✅ Function to unenroll from missing courses
  unenrollFromMissingCourses(missingCourseIds: string[]): void {
    if (!this.luser || !this.luser.id) {
      console.error('User not found in local storage.');
      return;
    }
  
    this.signService.getUserById(this.luser.id).subscribe({
      next: (user) => {
        if (!user || !user.courses) return;
  
        // Remove missing courses from user's enrolled courses
        const updatedCourses = user.courses.filter((id: string) => !missingCourseIds.includes(id));
        const updatedUser = { ...user, courses: updatedCourses };
  
        // Update the user in the database
        this.signService.updateUser(this.luser.id, updatedUser).subscribe({
          next: () => {
            Swal.fire({
              title: 'Unenrolled!',
              text: 'You have been unenrolled from missing courses.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
  
            // Update UI
            this.courseslist = updatedCourses;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error updating user courses:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      },
    });
  }
  
  

  course_delete(courseId: string): void {
    const user = JSON.parse(localStorage.getItem('users') || '{}');
    const userId = user.id;
    if (!userId) {
      Swal.fire({
        title: 'Access Denied!',
        text: 'User not logged in.',
        icon: 'warning',
        confirmButtonText: 'Login Now',
        confirmButtonColor: '#f39c12',
      });
      return;
    }

    const updatedCourses = user.courses.filter((course: string) => course !== courseId);
    const updatedUserData = { ...user, courses: updatedCourses };

    let courses = JSON.parse(localStorage.getItem('courses') || '[]');

    if (!Array.isArray(courses) || courses.length === 0) {
      console.error('Courses not found or empty in localStorage.');
      return;
    }
    const updatedCoursesList = courses.map((course: any) => {
      if (course.id === courseId) {
        return {
          ...course,
          students: course.students.filter((studentId: string) => studentId !== userId)
        };
      }
      return course;
    });
    localStorage.setItem('users', JSON.stringify(updatedUserData));
    localStorage.setItem('courses', JSON.stringify(updatedCoursesList));

    this.coursedata = this.coursedata.filter((course) => course.id !== courseId);

    this.signService.updateUser(userId, updatedUserData).subscribe({
      next: (res) => {
        console.log('User updated successfully:', res);
        Swal.fire({
          title: 'Deleted!',
          text: 'Course removed successfully!',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        });

        const updatedCourse = updatedCoursesList.find((course: any) => course.id === courseId);

        if (updatedCourse) {
          this.coursesService.updateCourse(courseId, updatedCourse).subscribe({
            next: () => console.log('Course updated successfully in backend!'),
            error: (err) => console.error('Error updating course:', err)
          });
        }
      },
      error: (err) => {
        console.error('Error removing course:', err);
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while removing the course.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      },
    });
    setTimeout(() => {
      window.location.reload();
    }, 500); 
  }

  ngAfterViewInit(): void {
    if (this.coursedata.length > 0) {
      this.createCharts();
    }
  }

  createCharts(): void {
    const courseNames = this.coursedata.map(course => course.courseName);
    const duration = this.coursedata.map(course => course.duration);
    const credits = this.coursedata.map(course => course.credits);

    new Chart(this.feeChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: courseNames,
        datasets: [{
          label: 'Course Duration',
          data: duration,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
        }]
      }
    });

    new Chart(this.creditsChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: courseNames,
        datasets: [{
          label: 'Course Credits',
          data: credits,
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ]
        }]
      }
    });
  }
}
