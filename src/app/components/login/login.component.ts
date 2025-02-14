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

  ngOnInit(){
    const luser = localStorage.getItem('users');
    console.log(luser);
    if(luser != null){
      Swal.fire({
        title: 'You are already Logged In!',
        text: 'Welcome Back!',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
      });
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(loginForm: any): void {

    if (loginForm.valid) {
      const email = loginForm.value.email;
      const password = loginForm.value.password; 

      this.signService.getUsers().subscribe({
        next: (users) => {
          const userDetail = users.find((user) => user.email === email);
          console.log(userDetail);
          
          const userPassword = users.find((user) => user.password === password);
          console.log(userPassword);
          
          const isActive = users.find((user) => user.active === true);
          console.log(isActive);

          //userDetail is storing boolean data?

          if (userDetail && userPassword && isActive) {
            this.store.dispatch(login({ user: userDetail }));

            Swal.fire({
              title: 'Welcome Back!',
              text: 'Login successful!',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false,
            });

            this.store
              .select((state: any) => state.auth.user.role)
              .pipe(map((role) => (role === 'student' ? '/dashboard' : role === 'instructor' ? '/dashboard' : '/dashboard')))
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
