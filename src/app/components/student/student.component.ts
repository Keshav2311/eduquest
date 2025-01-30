import { Component } from '@angular/core';
import { SignService } from '../../services/sign.service';
import { UserInterface } from '../../interfaces/user';
import { Courseinterface } from '../../interfaces/courses';
import { CoursesService } from '../../services/courses.service';
import Swal from 'sweetalert2';

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
  constructor(private signService: SignService, private coursesService: CoursesService) { }

  ngOnInit(): void {
    // Fetch user data on component initialization
    if (this.luser && this.luser.id) {
      this.signService.getUserById(this.luser.id).subscribe({
        next: (res) => {
          this.userInfo = res;
          this.courseslist = this.userInfo?.courses || [];
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

      this.coursesService

      Promise.all(courseRequests)
        .then((courses) => {
          this.coursedata = courses.filter((course) => course !== null);
          console.log('Fetched courses:', this.coursedata);
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
      }); return;
    }

    const updatedCourses = user.courses.filter((course: string) => course !== courseId);

    const updatedUserData = {
      ...user,
      courses: updatedCourses,
    };

    this.signService.updateUser(userId, updatedUserData).subscribe({
      next: (res) => {
        console.log('Course deleted successfully!', res);
        Swal.fire({
          title: 'Deleted!',
          text: 'Course deleted successfully!',
          icon: 'success',
          timer: 3000, // Auto closes after 3 seconds
          showConfirmButton: false
        }); 
        this.coursedata = this.coursedata.filter((course) => course.id !== courseId);
        localStorage.setItem('users', JSON.stringify(updatedUserData));
      },
      error: (err) => {
        console.error('Error deleting course:', err);
        alert('An error occurred while deleting the course.');
      },
    });
  }

}
