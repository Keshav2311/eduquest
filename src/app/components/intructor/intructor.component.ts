import { Component, OnInit } from '@angular/core';
import { SignService } from '../../services/sign.service';
import { CoursesService } from '../../services/courses.service';
import { UserInterface } from '../../interfaces/user';
import { Courseinterface } from '../../interfaces/courses';
import { Route, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-instructor',
  standalone: false,
  templateUrl: './intructor.component.html',
  styleUrls: ['./intructor.component.css']
})
export class IntructorComponent implements OnInit {
  instructor$: any[] = [];
  userInfo: UserInterface | undefined;
  luser = JSON.parse(localStorage.getItem('users') || '{}');
  courseslist: String[] = [];
  coursedata: Courseinterface[] = [];
  count: number = 0;

  constructor(private signService: SignService, private coursesService: CoursesService, private router: Router ) { }

  ngOnInit() {
    this.signService.getUserById(this.luser.id).subscribe({
      next: (res) => {
        this.userInfo = res;
        this.courseslist = this.userInfo?.courses || [];
        for (let i=0; i<this.courseslist.length; i++){
          this.count++;
        }
        console.log(this.courseslist);
        this.courseslist.forEach((courseId) => {
          this.coursesService.getcourseById(courseId).subscribe({
            next: (course) => {
              this.coursedata.push(course);
              console.log("courses are:", this.coursedata);
            },
            error: (err) => {
              console.error('There was an error!', err);
            }
          });
        });
      },
      error: (err) => {
        console.error('There was an error!', err);
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
  }

  course_edit(courseId: string): void{


  this.router.navigate(['/course_add', courseId]); // Navigate to the edit form with course ID

  
  }
}