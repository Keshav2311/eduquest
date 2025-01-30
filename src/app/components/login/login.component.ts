import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { SignService } from '../../services/sign.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
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

  constructor(private signService: SignService, private router: Router ,private authservice: AuthService) {}
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
            this.authservice.login(userdetail);

            Swal.fire({
              title: 'Welcome Back!',
              text: 'Login successful!',
              icon: 'success',
              timer: 3000, // Auto closes after 3 seconds
              showConfirmButton: false
            });            console.log(userdetail.role);
            if (userdetail.role === 'student') {
              this.router.navigate(['/student']);
              // alert("Student Dashboard");
            } 
            else if (userdetail.role === 'instructor') {
              this.router.navigate(['/instructor']);
            }
            else if (userdetail.role === 'admin') {
              this.router.navigate(['/admin']);
            }
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'User does not exist.',
              icon: 'error',
              timer: 3000, // Auto closes after 3 seconds
              showConfirmButton: false
            });          }
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          alert('An error occurred. Please try again later.');
        },
      });
    } else {
      Swal.fire({
        title: 'Invalid Email!',
        text: 'Please enter a valid email.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f39c12',
      });    }
  }
}
