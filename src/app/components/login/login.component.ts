import { Component } from '@angular/core';

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

  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Form Submitted:', this.user);
      alert('Login successful!');
      form.reset();
    }
  }
}
