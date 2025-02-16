import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SignService } from '../../services/sign.service';
import { UserInterface } from '../../interfaces/user';
import { Courseinterface } from '../../interfaces/courses';
import { CoursesService } from '../../services/courses.service';
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';
import * as Bootstrap from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  updateForm: FormGroup;
  selectedUser: UserInterface | null = null;
  users: UserInterface[] = [];

  @ViewChild('feeChart') feeChartRef!: ElementRef;
  @ViewChild('creditsChart') creditsChartRef!: ElementRef;

  constructor(private signService: SignService, private coursesService: CoursesService, private cdr: ChangeDetectorRef, private router: Router, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      experience: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.luser && this.luser.id) {
      this.signService.getUserById(this.luser.id).subscribe({
        next: (res) => {
          this.userInfo = res;
          this.courseslist = this.userInfo?.courses || [];
          this.count = this.courseslist.length;
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

  user_disable(id: string) {
    console.log("Hi, I am disabling the user");

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to disable this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, disable!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.signService.getUserById(id).subscribe((user) => {
          if (user) {
            const updatedUser = { ...user, active: false }; // Keep all data, change only 'active'

            this.signService.updateUser(id, updatedUser).subscribe(() => {
              Swal.fire('Disabled!', 'User has been disabled.', 'success').then(() => {
                localStorage.removeItem('users'); // Remove user data from local storage
                // let user = JSON.parse(localStorage.getItem('users') || '{}');
                // const isActive = user.active;
                // if(isActive === false){
                //   alert("user loggin required as this user is inactive")

                // }
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              });
            });
          } else {
            Swal.fire('Error', 'User not found!', 'error');
          }
        });
      }
    });
  }

  user_update(id: string) {
    this.signService.getUserById(id).subscribe(user => {
      this.selectedUser = user;
      this.updateForm.patchValue(user);
      const modal = new Bootstrap.Modal(document.getElementById('updateUserModal') as HTMLElement);
      modal.show();
    });
  }

  onUpdate() {
    this.signService.getUserById(this.luser.id).subscribe({

    });

    if (this.updateForm.valid) {
      const formData = {
        ...this.updateForm.value,
        role: this.userInfo?.role,
        password: this.userInfo?.password,
        courses: this.userInfo?.courses,
        active: this.userInfo?.active
      }
      const updatedUser = formData;
      this.signService.updateUser(updatedUser.id, updatedUser).subscribe({
        next: () => {
          Swal.fire('Updated!', 'User details updated successfully.', 'success');
          setTimeout(() => window.location.reload(), 500);
        },
        error: (err) => console.error('Error updating user:', err)
      });
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

  show_update(user: any): void {
    this.selectedUser = user;
    this.updateForm.patchValue(user);
    const modal = new Bootstrap.Modal(document.getElementById('updateUserModal') as HTMLElement);
    modal.show();
  }
}
