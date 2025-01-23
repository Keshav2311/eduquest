import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Route, Router} from '@angular/router';
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

  constructor(private loginService: LoginService, private router: Router) {}
  onSubmit(loginForm: any): void {
  if (loginForm.valid) {
    const email = loginForm.value.email; // Get email from the form

    this.loginService.getUsers().subscribe({
      next: (users) => {
        const userExists = users.some((user) => user.email === email); // Check email existence

        if (userExists) {
          alert('Login successful!');
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
