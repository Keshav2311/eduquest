import { Component, OnInit } from '@angular/core';
import { SignService } from '../../../services/sign.service';
import Swal from 'sweetalert2';
import { UserInterface } from '../../../interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  standalone: false,
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent implements OnInit{
  user = {
    name: '',
    forgot: '',
    confirm: '',
  };

  userInfo : UserInterface | undefined;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility(field: string): void {
    if (field === 'new') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  constructor(private signService: SignService, private router: Router) { }

  ngOnInit(): void {
    
      this.userInfo = JSON.parse(localStorage.getItem('users') || '{}');
      if(this.userInfo != null){
        this.router.navigate(['/**']);
      }
    }

  onSubmit(form: any): void {
    const { name, forgot, confirm } = this.user;

    if (!confirm) {
      alert('Please provide all required fields.');
      return;
    }

    this.signService.updatePassword(name, forgot, confirm).subscribe({
      next: (response) => {
        console.log('Password Updated successfully:', response)
        Swal.fire({
          title: 'Success!',
          text: 'Password updated successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745',
        });
      },
      error: (err) => {
        console.error('Error updating Password:', err);
        alert('Failed to update the Password. Please check the details.');
      }
    })

    if (form.valid) {
      console.log('Form Submitted:', this.user);
      alert('Password Set successful!');
      form.reset();
    }
  }
}
