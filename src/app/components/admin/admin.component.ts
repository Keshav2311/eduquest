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
  coursedata: Courseinterface | undefined;
  studentInfo: UserInterface[] = [];
  instructorInfo: UserInterface[] = [];
  displayedData: any[] = [];
  courses: any[] = [];
  students: string[] | undefined;
  selectedTable: String | undefined;

  luser = JSON.parse(localStorage.getItem('users') || '{}');
  loading: boolean = false;

  constructor(private signservice: SignService, private courseService: CoursesService) { }

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
  

  // deleteCourse(courseId: string): void {
  //   console.log("delete function invoked");
  //   this.courseService.getcourseById(courseId).subscribe({
  //     next: (res) => {
  //       this.coursedata = res;
  //       this.students = this.coursedata?.students;

  //       console.log(this.students);
  //       console.log(this.coursedata);
  //     },
  //     error: (err) => {
  //       console.error('Error fetching courses:', err);
  //     },
  //   });

  //   if (confirm('Are you sure you want to delete this course?')) {
  //     this.courseService.deleteCourse(courseId).subscribe({
  //       next: () => {
  //         Swal.fire({
  //           title: 'Deleted!',
  //           text: 'Course deleted successfully.',
  //           icon: 'success',
  //           timer: 2000, // Closes automatically after 2 seconds
  //           showConfirmButton: false
  //         });          // Update the list after deletion
  //         this.displayedData = this.displayedData.filter((course) => course.id !== courseId);

  //       },
  //       error: (err) => {
  //         console.error('Error deleting course:', err);
  //       },
  //     });
  //   }
  // }


  deleteCourse(courseId: string): void {
    console.log("Delete function invoked");
  
    this.courseService.getcourseById(courseId).subscribe({
      next: (course) => {
        if (!course || !course.students || course.students.length === 0) {
          // If no students are enrolled, directly delete the course
          this.confirmAndDeleteCourse(courseId);
          return;
        }
  
        this.removeCourseFromStudents(course.students, courseId).then(() => {
          // After updating students, delete the course
          this.confirmAndDeleteCourse(courseId);
        }).catch((error) => {
          console.error("Error updating students:", error);
        });
      },
      error: (err) => {
        console.error("Error fetching course details:", err);
      }
    });
  }
  
  // Helper function to update students and remove course from their list
  async removeCourseFromStudents(studentIds: string[], courseId: string) {
    const updatePromises = studentIds.map(studentId =>
      this.signservice.getUserById(studentId).toPromise().then(student => {
        if (!student || !student.courses) return;
  
        const updatedCourses = student.courses.filter((id: string)=> id !== courseId);
        const updatedUser = { ...student, courses: updatedCourses };
  
        return this.signservice.updateUser(studentId, updatedUser).toPromise();
      })
    );
  
    await Promise.all(updatePromises);
  }
  
  // Helper function to confirm and delete course
  confirmAndDeleteCourse(courseId: string): void {
    if (confirm("Are you sure you want to delete this course?")) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          Swal.fire({
            title: "Deleted!",
            text: "Course deleted successfully.",
            icon: "success",
            timer: 2000, // Closes automatically after 2 seconds
            showConfirmButton: false
          });
  
          // Update UI to remove the deleted course
          this.displayedData = this.displayedData.filter(course => course.id !== courseId);
        },
        error: (err) => {
          console.error("Error deleting course:", err);
        }
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
