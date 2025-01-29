import { Component } from '@angular/core';
import { UserInterface } from '../../interfaces/user';
import { SignService } from '../../services/sign.service';
import { CoursesService } from '../../services/courses.service';


@Component({
  selector: 'app-admin',
  standalone: false,
  
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  admin$: any[] = [];
  
  adminInfo: UserInterface | undefined;
  studentInfo: UserInterface[] = [];
  instructorInfo: UserInterface[] = [];
  displayedData: UserInterface[] = [];

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

  showTable(type: string): void {
    if (type === 'student') {
      this.displayedData = this.studentInfo;
    } else if (type === 'instructor') {
      this.displayedData = this.instructorInfo;
    }
  }

  deleteUser(userId: String): void {
    console.log("delete function invoked");
    if (confirm('Are you sure you want to delete this user?')) {
      this.signservice.deleteUser(userId).subscribe({
        next: () => {
          alert('User deleted successfully.');
          // Update the list after deletion
          this.displayedData = this.displayedData.filter((user) => user.id !== userId);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        },
      });
    }
  }
}
