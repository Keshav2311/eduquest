import { Component } from '@angular/core';
import { UserInterface } from '../../interfaces/user';
import { SignService } from '../../services/sign.service';
import { CoursesService } from '../../services/courses.service';
import { Courseinterface } from '../../interfaces/courses';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin',
  standalone: false,
  
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  admin$: any[] = [];
  
  adminInfo: UserInterface | undefined;
  coursesInfo: Courseinterface[] = [];
  studentInfo: UserInterface[] = [];
  instructorInfo: UserInterface[] = [];
  displayedData: UserInterface[] = [];
  displayedCoursesData: Courseinterface[] = [];
  showCourses = false;
  showData = false;
  courses: any[] = [];


  luser = JSON.parse(localStorage.getItem('users') || '{}');

  constructor(private signservice: SignService, private courseService: CoursesService) { }

  ngOnInit(): void {
    if (this.luser && this.luser.id) {
      this.signservice.getUserById(this.luser.id).subscribe({
        next: (res) => {
          this.adminInfo = res;
          console.log(this.adminInfo);
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
    this.deleteUser = this.deleteUser.bind(this);
  }
  
  fetchUsers(): void {
    this.signservice.getUsers().subscribe({
      next: (res) => {
        this.studentInfo = res.filter((user: UserInterface) => user.role === 'student');
        this.instructorInfo = res.filter((user: UserInterface) => user.role === 'instructor');

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
        console.log('Courses:', this.coursesInfo);
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      },
    });
  }

  showTable(type: string): void {
    this.showData = !this.showData;
    if(this.showData) {
      if (type === 'student') {
        this.displayedData = this.studentInfo;
      } else if (type === 'instructor') {
        this.displayedData = this.instructorInfo;
      }
    } 
    else {
      this.displayedData = [];
    }
  }

  showCoursesTable() {
    this.showCourses = !this.showCourses;
    if (this.showCourses) {
      this.displayedCoursesData = this.coursesInfo;
    } else {
      this.displayedCoursesData = [];
    }
  }

  deleteCourse(courseId: string): void {
    console.log("delete function invoked");
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          Swal.fire({
            title: 'Deleted!',
            text: 'Course deleted successfully.',
            icon: 'success',
            timer: 2000, // Closes automatically after 2 seconds
            showConfirmButton: false
          });          // Update the list after deletion
          this.displayedCoursesData = this.displayedCoursesData.filter((course) => course.id !== courseId);
        },
        error: (err) => {
          console.error('Error deleting course:', err);
        },
      });
    }
  }

  deleteUser(userId: String): void {
    localStorage.setItem('userId', JSON.stringify(userId));
    console.log("delete function invoked");
    if (confirm('Are you sure you want to delete this user?')) {
      this.signservice.deleteUser(userId).subscribe({
        next: () => {
          Swal.fire({
            title: 'Deleted!',
            text: 'User deleted successfully.',
            icon: 'success',
            timer: 2000, // Closes automatically after 2 seconds
            showConfirmButton: false
          });          // Update the list after deletion
          this.displayedData = this.displayedData.filter((user) => user.id !== userId);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        },
      });
    }

  }
}
