import { Component, Input, OnInit } from '@angular/core';
import { SignService } from '../../services/sign.service';

@Component({
  selector: 'app-instructor',
  standalone: false,
   templateUrl: './intructor.component.html',
  styleUrl: './intructor.component.css'
})
export class IntructorComponent implements OnInit {
  instructor$: any[] = []; // Holds the list of instructors
  userInfo :any[]=[];
  constructor(private signService: SignService) {}



  ngOnInit() {
    // Fetch users from the service
    this.signService.getUsers().subscribe({
      next: (res) => {
        this.instructor$ = res; // Assign the fetched data to instructor$
        console.log('Fetched instructors:', this.instructor$);

        // Check localStorage for user data
        let userData = JSON.parse(localStorage.getItem('users') || '{}');
        if (userData && userData.email) {
          const email = userData.email;
          console.log('User email from localStorage:', email);

          // Find matching instructor
          const matchingInstructor = this.instructor$.find(
            (instructor: any) => instructor.email === email
          );

          if (matchingInstructor) {
            console.log('Matching instructor found:', matchingInstructor);
            this.userInfo = matchingInstructor;
          } else {
            console.log('No matching instructor found.');
          }
        } else {
          console.log('No user data in localStorage.');
        }
      },
      error: (err) => {
        console.error('Error fetching instructors:', err);
      },
    });
  }

  
}
