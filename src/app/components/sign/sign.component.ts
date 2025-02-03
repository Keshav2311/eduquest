import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SignService } from '../../services/sign.service';
import { UserInterface } from '../../interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign',
  standalone: false,
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css'], // Fixed styleUrls key
})
export class SignComponent {
  step = 1; 
  signupForm: FormGroup;
  user: UserInterface | undefined;

  constructor(private fb: FormBuilder, private signService: SignService) {
    this.signupForm = this.fb.group({
      page1: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
      }),
      page2: this.fb.group({
        role: ['', Validators.required], // 'student' or 'instructor'
        experience: [
          '',
          [Validators.required, Validators.min(0), Validators.max(12)],
        ],
      }),
      page3: this.fb.group({
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      }),
    });

    this.signupForm.get('page2.role')?.valueChanges.subscribe((role) => {
      if (role === 'instructor') {
        this.signupForm.get('page2.experience')?.setValidators([
          Validators.required,
          Validators.pattern('^(0|[1-9]|1[0-2])$'),
        ]);
      } else {
        this.signupForm.get('page2.experience')?.setValidators([
          Validators.required,
          Validators.pattern('^(19|20)\\d{2}$'), // Year format validation
        ]);
      }
      this.signupForm.get('page2.experience')?.updateValueAndValidity();
    });
  }

  // Navigate to the next page if the current page is valid
  nextStep(): void {
    if (this.isCurrentPageValid()) {
      this.step++;
    }
  }

  // Navigate to the previous page
  previousStep(): void {
    this.step--;
  }

  // Check if the current page is valid
  isCurrentPageValid(): boolean {
    const currentGroup = this.getCurrentPageGroup();
    return currentGroup.valid;
  }

  // Get the form group for the current page
  getCurrentPageGroup(): FormGroup {
    return this.signupForm.get(`page${this.step}`) as FormGroup;
  }

  // Submit the form
  onSubmit(): void {
    const { password, confirmPassword } = this.signupForm.get('page3')?.value;
    if (password === confirmPassword) {
      const formData = {
        ...this.signupForm.get('page1')?.value,
        ...this.signupForm.get('page2')?.value,
        ...this.signupForm.get('page3')?.value,
      };

      delete formData.confirmPassword; // Remove confirmPassword before sending
      console.log(formData);
      localStorage.setItem("users", JSON.stringify(formData))

      this.signService.addItem(formData).subscribe({
        next: (response) => {
          console.log('Contact Detail Data added:', response);
          Swal.fire({
            title: 'Welcome!',
            text: 'Sign-up Successful!',
            icon: 'success',
            confirmButtonText: 'Continue',
            confirmButtonColor: '#28a745',
          });          // localStorage.setItem("users", JSON.stringify(response))
          this.signupForm.reset();
          this.step = 1; // Reset to the first step
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to submit the form. Please try again.');
        },
      });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Passwords do not match!',
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#d33',
      });    }
  }
}
