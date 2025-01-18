import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot',
  standalone: false,
  
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent {
  user = {
    name: '',
    forgot: '',
    confirm: '',
  };

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility(field: string): void {
    if (field === 'new') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Form Submitted:', this.user);
      alert('Password Set successful!');
      form.reset();
    }
  }
}
