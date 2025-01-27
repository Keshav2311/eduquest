import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { SignService } from '../../services/sign.service';
@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  user = {
    name: '',
    email: '',
    password: '',
    remember: false,
  };

  constructor(private signService: SignService, private router: Router) {}
  onSubmit(loginForm: any): void {
    if (loginForm.valid) {
      const email = loginForm.value.email; // Get email from the form

      const userType = loginForm.value.role;

      // localStorage.setItem("users", JSON.stringify(loginForm));


      this.signService.getUsers().subscribe({
        next: (users) => {
          const userExists = users.some((user) => user.email === email); // Check email existence
          const userdetail = users.find((user) => user.email === email); // Check email existence
          console.log(userdetail);

          if (userExists) {
            localStorage.setItem("users", JSON.stringify(userdetail))

            alert('Login successful!');
            console.log(userdetail.role);
            if (userdetail.role === 'student') {
              this.router.navigate(['/student']);
              // alert("Student Dashboard");
            } else {
              this.router.navigate(['/intructor']);
            }
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
