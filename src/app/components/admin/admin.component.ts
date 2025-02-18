import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserInterface } from '../../interfaces/user';
import { SignService } from '../../services/sign.service';
import { CoursesService } from '../../services/courses.service';
import { Courseinterface } from '../../interfaces/courses';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Bootstrap from 'bootstrap';
import Chart from 'chart.js/auto';




@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  admin$: any[] = [];

  adminInfo: UserInterface | undefined;
  coursesInfo: Courseinterface[] = [];
  coursedata: Courseinterface | undefined;
  studentInfo: UserInterface[] = [];
  instructorInfo: UserInterface[] = [];
  displayedData: any[] = [];
  courses: any[] = [];
  students: string[] | undefined;
  selectedTable: String | undefined;
  course: Courseinterface | undefined;

  luser = JSON.parse(localStorage.getItem('users') || '{}');
  loading: boolean = false;

  updateForm: FormGroup;
  selectedUser: UserInterface | null = null;
  users: UserInterface[] = [];

  @ViewChild('studentChart') studentChartRef!: ElementRef;
  @ViewChild('instructorChart') instructorChartRef!: ElementRef;
  studentChart!: Chart;
  instructorChart!: Chart;

  constructor(private signservice: SignService, private courseService: CoursesService, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.luser && this.luser.id) {
      this.signservice.getUserById(this.luser.id).subscribe({
        next: (res) => {
          this.adminInfo = res;
        },
        error: (err) => {
          console.error('Error fetching user information:', err);
        }
      });
    }
    else {
      console.error('No user found in local storage');
    }

    this.fetchUsers();
    this.fetchCourses();
    this.showTable('courses')
  }

  fetchUsers(): void {
    this.signservice.getUsers().subscribe({
      next: (res) => {
        this.studentInfo = res.filter((user: UserInterface) => user.role === 'student');
        this.instructorInfo = res.filter((user: UserInterface) => user.role === 'instructor');
        // this.createInstructorChart();

        console.log('Students:', this.studentInfo);
        console.log('Instructors:', this.instructorInfo);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  fetchCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (res) => {
        this.coursesInfo = res;
        // this.createStudentChart();
        console.log('Courses:', this.coursesInfo);
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      },
    });
  }

  // createStudentChart(): void {
  //   const courseLabels = this.coursesInfo.map(course => course.courseName);
  //   const studentCounts = this.coursesInfo.map(course => course.students?.length || 0);

  //   this.studentChart = new Chart(this.studentChartRef.nativeElement, {
  //     type: 'bar',
  //     data: {
  //       labels: courseLabels,
  //       datasets: [{
  //         label: 'Students per Course',
  //         data: studentCounts,
  //         backgroundColor: 'rgba(54, 162, 235, 0.5)',
  //         borderColor: 'rgba(54, 162, 235, 1)',
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       scales: {
  //         y: { beginAtZero: true }
  //       }
  //     }
  //   });
  // }

  // createInstructorChart(): void {
  //   // Destroy previous instance if it exists
  //   if (this.instructorChart) {
  //     this.instructorChart.destroy();
  //   }

  //   const experienceData = this.instructorInfo.map(inst => inst.experience || 0);
  //   const instructorNames = this.instructorInfo.map(inst => inst.name);

  //   this.instructorChart = new Chart(this.instructorChartRef.nativeElement, {
  //   //   type: 'pie',
  //   //   data: {
  //   //     labels: instructorNames,
  //   //     datasets: [{
  //   //       label: 'Years of Experience',
  //   //       data: experienceData,
  //   //       backgroundColor: [
  //   //         '#FF6384',
  //   //         '#36A2EB',
  //   //         '#FFCE56',
  //   //         '#4BC0C0',
  //   //         '#9966FF',
  //   //         '#a8d0e6',
  //   //         '#f76c6c'
  //   //       ],
  //   //     }]
  //   //   },
  //   //   options: {
  //   //     responsive: true
  //   //   }
  //   // });
  // }



  showTable(type: string): void {
    if (this.selectedTable === type) {
      this.selectedTable = undefined;
      this.displayedData = [];
    } else {
      this.selectedTable = type;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        if (type === 'student') {
          this.displayedData = this.studentInfo;
        } else if (type === 'instructor') {
          this.displayedData = this.instructorInfo;
        } else if (type === 'courses') {
          this.displayedData = this.coursesInfo;
        }
      }, 1000);
    }
  }

  user_update(id: string) {
    this.signservice.getUserById(id).subscribe(user => {
      this.selectedUser = user;
      this.updateForm.patchValue(user);
      const modal = new Bootstrap.Modal(document.getElementById('updateUserModal') as HTMLElement);
      modal.show();
    });
  }

  onUpdate() {
    this.signservice.getUserById(this.luser.id).subscribe({

    });

    if (this.updateForm.valid) {
      const formData = {
        ...this.updateForm.value,
        role: this.adminInfo?.role,
        experience: this.adminInfo?.experience,
        password: this.adminInfo?.password,
        courses: this.adminInfo?.courses,
        active: this.adminInfo?.active
      }
      const updatedUser = formData;
      this.signservice.updateUser(updatedUser.id, updatedUser).subscribe({
        next: () => {
          Swal.fire('Updated!', 'User details updated successfully.', 'success');
          setTimeout(() => window.location.reload(), 500);
        },
        error: (err) => console.error('Error updating user:', err)
      });
    }
  }

  desable_User(userId: string): void {
    console.log("Toggling user status...");

    // Fetch the user details
    this.signservice.getUserById(userId).subscribe((user) => {
      if (user) {
        const newStatus = !user.active; // Toggle active status

        Swal.fire({
          title: 'Are you sure?',
          text: `You want to ${newStatus ? 'enable' : 'disable'} this user!`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: newStatus ? '#28a745' : '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: `Yes, ${newStatus ? 'enable' : 'disable'}!`
        }).then((result) => {
          if (result.isConfirmed) {
            const updatedUser = { ...user, active: newStatus };

            this.signservice.updateUser(userId, updatedUser).subscribe(() => {
              Swal.fire(
                newStatus ? 'Enabled!' : 'Disabled!',
                `User has been ${newStatus ? 'enabled' : 'disabled'}.`,
                'success'
              ).then(() => {

                // Update displayed data in UI
                this.displayedData = this.displayedData.map(u =>
                  u.id === userId ? updatedUser : u
                );

                // Update local storage
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                users = users.map((u: any) => (u.id === userId ? updatedUser : u));
                localStorage.setItem('users', JSON.stringify(users));

                // If the logged-in user is disabled, log them out
                const loggedInUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                if (loggedInUser.id === userId && !newStatus) {
                  localStorage.removeItem('currentUser');

                }
              });
            });
          }
        });
      } else {
        Swal.fire('Error', 'User not found!', 'error');
      }
    });
  }

  toggleCourseStatus(courseId: string): void {
    console.log("Toggling course status...");
  
    // Find the course from the current list
    const courseIndex = this.coursesInfo.findIndex((c: any) => c.id === courseId);
  
    if (courseIndex === -1) {
      Swal.fire('Error', 'Course not found!', 'error');
      return;
    }
  
    const newStatus = !this.coursesInfo[courseIndex].flag; // Toggle flag
  
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
        // **Update the UI immediately**
        this.coursesInfo[courseIndex] = { ...this.coursesInfo[courseIndex], flag: newStatus };
  
        const updatedCourse = this.coursesInfo[courseIndex];
  
        this.courseService.updateCourse(courseId, updatedCourse).subscribe(() => {
          Swal.fire(
            newStatus ? 'Enabled!' : 'Disabled!',
            `Course has been ${newStatus ? 'enabled' : 'disabled'}.`,
            'success'
          );
  
          // Update local storage
          let courses = JSON.parse(localStorage.getItem('courses') || '[]');
          courses = courses.map((c: any) => (c.id === courseId ? updatedCourse : c));
          localStorage.setItem('courses', JSON.stringify(courses));
        }, error => {
          // **Revert UI change if API fails**
          this.coursesInfo[courseIndex].flag = !newStatus;
          Swal.fire('Error', 'Failed to update course status!', 'error');
        });
      }
    });
  }
  
}
