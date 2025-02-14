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
  course: Courseinterface | undefined;

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
  }

  fetchUsers(): void {
    debugger;
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
    debugger;
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
    const course = this.coursesInfo.find((c: any) => c.id === courseId);
  
    if (!course) {
      Swal.fire('Error', 'Course not found!', 'error');
      return;
    }
  
    const newStatus = !course.flag; // Toggle active status
  
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
        const updatedCourse = { ...course, active: newStatus };
  
        this.courseService.updateCourse(courseId, updatedCourse).subscribe(() => {
          Swal.fire(
            newStatus ? 'Enabled!' : 'Disabled!',
            `Course has been ${newStatus ? 'enabled' : 'disabled'}.`,
            'success'
          ).then(() => {
            // Refresh courses after updating
            this.fetchCourses();
  
            // Update local storage
            let courses = JSON.parse(localStorage.getItem('courses') || '[]');
            courses = courses.map((c: any) => (c.id === courseId ? updatedCourse : c));
            localStorage.setItem('courses', JSON.stringify(courses));
          });
        });
      }
    });
  }
  
  
  
  


  // deleteInstructor(userId: string): void {
  //   console.log("Delete function invoked");

  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "This will permanently remove the user and update their enrolled courses.",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Yes, delete!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.signservice.getUserById(userId).subscribe({
  //         next: (user) => {
  //           if (!user || !user.courses || user.courses.length === 0) {
  //             // No courses enrolled, delete user directly
  //             this.confirmAndDeleteInstructor(userId);
  //             return;
  //           }

  //           // Step 1: Remove the user from enrolled courses
  //           this.updateCoursesForDeletedInstructor(user.courses, userId)
  //             .then(() => this.confirmAndDeleteInstructor(userId))
  //             .catch((err) => console.error("Error updating courses:", err));
  //         },
  //         error: (err) => console.error("Error fetching user details:", err),
  //       });
  //     }
  //   });
  // }

  // // ✅ Helper function to update courses and remove user from enrolled students
  // async updateCoursesForDeletedInstructor(courseIds: string[], userId: string): Promise<void> {
  //   const courseUpdatePromises = courseIds.map(courseId =>
  //     this.courseService.getcourseById(courseId).toPromise().then(course => {
  //       if (!course || !course.students) return;

  //       const updatedStudents = course.students.filter((id: string) => id !== userId);

  //       return this.courseService.updateCourse(courseId, { ...course, students: updatedStudents }).toPromise();
  //     })
  //   );

  //   await Promise.all(courseUpdatePromises);
  // }

  // // ✅ Helper function to confirm and delete user
  // confirmAndDeleteInstructor(userId: string): void {
  //   this.signservice.deleteUser(userId).subscribe({
  //     next: () => {
  //       Swal.fire("Deleted!", "User has been deleted.", "success");

  //       // Update UI to remove the deleted user
  //       this.displayedData = this.displayedData.filter(user => user.id !== userId);
  //     },
  //     error: (err) => console.error("Error deleting user:", err),
  //   });
  // }


  // deleteStudent(userId: string): void {
  //   console.log("Delete function invoked for student");

  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "This will permanently remove the student and update enrolled courses.",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Yes, delete!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.signservice.getUserById(userId).subscribe({
  //         next: (user) => {
  //           if (!user || !user.courses || user.courses.length === 0) {
  //             // No courses enrolled, delete student directly
  //             this.confirmAndDeleteStudent(userId);
  //             return;
  //           }

  //           // Step 1: Remove student ID from enrolled courses
  //           this.updateCoursesForDeletedStudent(user.courses, userId)
  //             .then(() => this.confirmAndDeleteStudent(userId))
  //             .catch((err) => console.error("Error updating courses:", err));
  //         },
  //         error: (err) => console.error("Error fetching student details:", err),
  //       });
  //     }
  //   });
  // }

  // // ✅ Helper function to update courses and remove student from enrolled students
  // async updateCoursesForDeletedStudent(courseIds: string[], userId: string): Promise<void> {
  //   const courseUpdatePromises = courseIds.map(courseId =>
  //     this.courseService.getcourseById(courseId).toPromise().then(course => {
  //       if (!course || !course.students) return;

  //       const updatedStudents = course.students.filter((id: string) => id !== userId);

  //       return this.courseService.updateCourse(courseId, { ...course, students: updatedStudents }).toPromise();
  //     })
  //   );

  //   await Promise.all(courseUpdatePromises);
  // }

  // // ✅ Helper function to confirm and delete student
  // confirmAndDeleteStudent(userId: string): void {
  //   this.signservice.deleteUser(userId).subscribe({
  //     next: () => {
  //       Swal.fire("Deleted!", "Student has been deleted.", "success");

  //       // Update UI to remove the deleted student
  //       this.displayedData = this.displayedData.filter(user => user.id !== userId);
  //     },
  //     error: (err) => console.error("Error deleting student:", err),
  //   });
  // }
}
