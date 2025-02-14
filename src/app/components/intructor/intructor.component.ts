import { Component, OnInit } from '@angular/core';
import { SignService } from '../../services/sign.service';
import { CoursesService } from '../../services/courses.service';
import { UserInterface } from '../../interfaces/user';
import { Courseinterface } from '../../interfaces/courses';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

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


  constructor(private signService: SignService, private coursesService: CoursesService, private router: Router ) { }

  ngOnInit() {
    this.signService.getUserById(this.luser.id).subscribe({
      next: (res) => {
        this.userInfo = res;
        this.courseslist = this.userInfo?.courses || [];
        this.count = this.courseslist.length;  
        console.log(this.count);
        
        if (this.courseslist.length > 0) {
          // Fetch all courses in parallel using forkJoin
          forkJoin(this.courseslist.map(courseId => this.coursesService.getcourseById(courseId)))
            .subscribe({

              next: (courses) => {
                console.log(courses);
                

                this.coursedata = courses;
                this.countStudent = this.coursedata.reduce((total, course) => total + (course?.students?.length || 0), 0);
                console.log('Courses:', this.coursedata);
                console.log('Total students:', this.countStudent);
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

  course_delete(courseId: string): void {
    this.coursesService.deleteCourse(courseId).subscribe({
      next: (res) => {
        console.log('Course deleted successfully!', res);
        Swal.fire({
          title: 'Course Deleted Successful!',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2500,
          confirmButtonColor: '#3085d6',
      });        this.coursedata = this.coursedata.filter((course) => course.id !== courseId);
      },
      error: (err) => {
        console.error('There was an error!', err);
      }
    });
    setTimeout(() => {
      window.location.reload();
    }, 500); 
  }

  course_edit(courseId: string): void{
  this.router.navigate(['/course_add', courseId]);
  }
}