import { Component, OnInit } from '@angular/core';
import { SignService } from '../../services/sign.service';
import { CoursesService } from '../../services/courses.service';
import { UserInterface } from '../../interfaces/user';
import { Courseinterface } from '../../interfaces/courses';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import * as Bootstrap from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-instructor',
  standalone: false,
  templateUrl: './intructor.component.html',
  styleUrls: ['./intructor.component.css']
})
export class IntructorComponent implements OnInit {
  userInfo: UserInterface | undefined;
  
  luser = JSON.parse(localStorage.getItem('users') || '{}');
  courseslist: String[] = [];
  coursedata: Courseinterface[] = [];
  count: number = 0;
  countStudent: number = 0;

  updateForm: FormGroup;
  selectedUser: UserInterface | null = null;
  users: UserInterface[] = [];


  constructor(private signService: SignService, private coursesService: CoursesService, private router: Router, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      experience: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.signService.getUserById(this.luser.id).subscribe({
      next: (res) => {
        this.userInfo = res;
        this.courseslist = this.userInfo?.courses || [];
        this.count = this.courseslist.length;

        if (this.courseslist.length > 0) {
          forkJoin(this.courseslist.map(courseId => this.coursesService.getcourseById(courseId)))
            .subscribe({
              next: (courses) => {
                this.coursedata = courses;
                this.countStudent = this.coursedata.reduce((total, course) => total + (course?.students?.length || 0), 0);
              },
              error: (err) => console.error('Error fetching courses:', err)
            });
        }
      },
      error: (err) => console.error('Error fetching user:', err)
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

  toggleCourseStatus(courseId: string, currentStatus: boolean): void {
    const newStatus = !currentStatus; // Toggle flag
  
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to ${newStatus ? 'enable' : 'disable'} this course!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus ? '#28a745' : '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Yes, ${newStatus ? 'enable' : 'disable'}!`
    }).then((result) => {
      if (result.isConfirmed) {
        // **Find and update the course locally**
        const courseIndex = this.coursedata.findIndex((c: any) => c.id === courseId);
        if (courseIndex === -1) {
          Swal.fire('Error', 'Course not found!', 'error');
          return;
        }
  
        this.coursedata[courseIndex].flag = newStatus;  // ✅ Update UI instantly
  
        const updatedCourse = { ...this.coursedata[courseIndex], flag: newStatus };
  
        this.coursesService.updateCourse(courseId, updatedCourse).subscribe({
          next: () => {
            Swal.fire(
              newStatus ? 'Enabled!' : 'Disabled!',
              `Course has been ${newStatus ? 'enabled' : 'disabled'}.`,
              'success'
            );
  
            // **Update local storage**
            let courses = JSON.parse(localStorage.getItem('courses') || '[]');
            courses = courses.map((c: any) => (c.id === courseId ? updatedCourse : c));
            localStorage.setItem('courses', JSON.stringify(courses));
          },
          error: () => {
            // **Revert UI if API fails**
            this.coursedata[courseIndex].flag = !newStatus;
            Swal.fire('Error', 'Failed to update course status!', 'error');
          }
        });
      }
    });
  }
  
  

  course_edit(courseId: string): void {
    this.router.navigate(['/course_add/', courseId]);
  }

  show_update(user: any): void {
    this.selectedUser = user;
    this.updateForm.patchValue(user);
    const modal = new Bootstrap.Modal(document.getElementById('updateUserModal') as HTMLElement);
    modal.show();
  }
}