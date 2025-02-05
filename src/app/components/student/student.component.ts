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
    // Fetch user data on component initialization
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
    if (this.courseslist.length > 0) {
      const courseRequests = this.courseslist.map((courseId) =>
        this.coursesService.getcourseById(courseId).toPromise()
      );


      Promise.all(courseRequests)
        .then((courses) => {
          this.coursedata = courses.filter((course) => course !== null);
          console.log('Fetched courses:', this.coursedata);

          this.cdr.detectChanges(); // Ensure Angular detects changes
          this.createCharts(); // Create charts after data is fetched
        })
        .catch((err) => {
          console.error('Error fetching courses:', err);
        });
    } else {
      console.log('No courses found for the user.');
    }
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

    // Step 1: Remove course from the user's enrolled courses
    const updatedCourses = user.courses.filter((course: string) => course !== courseId);
    const updatedUserData = { ...user, courses: updatedCourses };

    // Step 2: Fetch courses from localStorage
    let courses = JSON.parse(localStorage.getItem('courses') || '[]');

    if (!Array.isArray(courses) || courses.length === 0) {
      console.error('Courses not found or empty in localStorage.');
      return;
    }
    // Step 3: Update courses array (remove student ID from the course)
    const updatedCoursesList = courses.map((course: any) => {
      if (course.id === courseId) {
        return {
          ...course,
          students: course.students.filter((studentId: string) => studentId !== userId)
        };
      }
      return course;
    });
    // Step 4: Update localStorage for users and courses
    localStorage.setItem('users', JSON.stringify(updatedUserData));
    localStorage.setItem('courses', JSON.stringify(updatedCoursesList));

    // Step 5: Remove course from displayed list
    this.coursedata = this.coursedata.filter((course) => course.id !== courseId);

    // Step 6: Update backend
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
  }


  ngAfterViewInit(): void {
    if (this.coursedata.length > 0) {
      this.createCharts();
    }
  }

  createCharts(): void {
    const courseNames = this.coursedata.map(course => course.courseName);
    const fees = this.coursedata.map(course => course.courseFee);
    const credits = this.coursedata.map(course => course.credits);

    new Chart(this.feeChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: courseNames,
        datasets: [{
          label: 'Course Fees',
          data: fees,
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
      type: 'doughnut',
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
