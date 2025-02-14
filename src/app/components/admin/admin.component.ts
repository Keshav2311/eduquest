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

  deleteCourse(courseId: string): void {
    console.log("Delete function invoked");

    this.courseService.getcourseById(courseId).subscribe({
      next: (course) => {
        if (!course || !course.students || course.students.length === 0) {
          // If no students are enrolled, delete the course immediately
          this.confirmAndDeleteCourse(courseId);
          return;
        }

        // Remove course from students and then delete the course
        this.removeCourseFromUsers(course.students, courseId)
          .then(() => this.confirmAndDeleteCourse(courseId))
          .catch((error) => console.error("Error updating students:", error));
      },
      error: (err) => console.error("Error fetching course details:", err),
    });
  }

  // ✅ Helper function to update students and remove course from their list
  async removeCourseFromUsers(studentIds: string[], courseId: string): Promise<void> {
    const updatePromises = studentIds.map(studentId =>
      this.signservice.getUserById(studentId).toPromise().then(student => {
        if (!student || !student.courses) return;

        const updatedCourses = student.courses.filter((id: string) => id !== courseId);
        return this.signservice.updateUser(studentId, { ...student, courses: updatedCourses }).toPromise();
      })
    );

    // Fetch all instructors safely
    const allUsers = await this.signservice.getUsers().toPromise();
    if (!allUsers || !Array.isArray(allUsers)) {
      console.error("Failed to fetch users or received invalid data.");
      return;
    }

    // Filter instructors with the course
    const instructorsToUpdate = allUsers.filter(user =>
      user.role === 'instructor' && user.courses && user.courses.includes(courseId)
    );

    // Remove course from instructors' course array
    const instructorUpdatePromises = instructorsToUpdate.map(instructor => {
      const updatedCourses = instructor.courses.filter((id: string) => id !== courseId);
      return this.signservice.updateUser(instructor.id, { ...instructor, courses: updatedCourses }).toPromise();
    });

    await Promise.all([...updatePromises, ...instructorUpdatePromises]);

    console.log(`Course ${courseId} removed from students and instructors.`);
  }



  // ✅ Helper function to confirm and delete course
  confirmAndDeleteCourse(courseId: string): void {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCourse(courseId).subscribe({
          next: () => {
            Swal.fire("Deleted!", "Course has been deleted.", "success");

            // Update UI to remove the deleted course
            this.displayedData = this.displayedData.filter(course => course.id !== courseId);
          },
          error: (err) => console.error("Error deleting course:", err),
        });
      }
    });
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
