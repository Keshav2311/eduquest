import { Component } from '@angular/core';
import { Route, Router} from '@angular/router';
import { SignService } from '../../services/sign.service';
@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = {
    name: '',
    email: '',
    password: '',
    remember: false
  };

  constructor(private signService: SignService, private router: Router) {}
  onSubmit(loginForm: any): void {
  if (loginForm.valid) {
    const email = loginForm.value.email; // Get email from the form

    this.signService.getUsers().subscribe({
      next: (users) => {
        const userExists = users.some((user) => user.email === email); // Check email existence
        
        if (userExists) {
          alert('Login successful!');
          // if(userType === "student"){
          //   this.router.navigate(['/student']);
          //   alert("Student Dashboard");
          // }
          // else{
          //   this.router.navigate(['/intructor']);
          // }
          this.router.navigate(['/home']); // Navigate to home page
        } else {
          alert('User does not exist.');
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        alert('An error occurred. Please try again later.');
      },
    });
  } else {
    alert('Please enter a valid email.');
  }
}
}
