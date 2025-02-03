import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignService } from '../../services/sign.service';
import { Store } from '@ngrx/store';
import { login } from '../../action/auth.action';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

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

  constructor(
    private signService: SignService,
    private router: Router,
    private store: Store
  ) {}

  onSubmit(loginForm: any): void {
    if (loginForm.valid) {
      const email = loginForm.value.email; // Get email from the form

      this.signService.getUsers().subscribe({
        next: (users) => {
          const userDetail = users.find((user) => user.email === email); // Find user by email

          if (userDetail) {
            // Dispatch login action to update NgRx store
            this.store.dispatch(login({ user: userDetail }));

            Swal.fire({
              title: 'Welcome Back!',
              text: 'Login successful!',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false,
            });

            // Redirect based on role using NgRx state
            this.store
              .select((state: any) => state.auth.user.role)
              .pipe(map((role) => (role === 'student' ? '/student' : role === 'instructor' ? '/instructor' : '/admin')))
              .subscribe((route) => this.router.navigate([route]));
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'User does not exist.',
              icon: 'error',
              timer: 3000,
              showConfirmButton: false,
            });
          }
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred. Please try again later.',
            icon: 'error',
            showConfirmButton: true,
          });
        },
      });
    } else {
      Swal.fire({
        title: 'Invalid Email!',
        text: 'Please enter a valid email.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f39c12',
      });
    }
  }
}
