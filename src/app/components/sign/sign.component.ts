import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sign',
  standalone: false,
  
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.css'
})
export class SignComponent {
  step = 1; // Current form page
  signupForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      page1: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        role: ['', Validators.required] // 'student' or 'instructor'
      }),
      page2: this.fb.group({
        interest: ['', Validators.required],
        experience: [
          '',
          [Validators.required, Validators.min(0), Validators.max(12)]
        ]
      }),
      page3: this.fb.group({
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
          ]
        ],
        confirmPassword: ['', Validators.required]
      })
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
      console.log('Form Submitted:', this.signupForm.value);
      alert('Sign-up Successful!');
      this.signupForm.reset();
      this.step = 1; // Reset to the first step
    } else {
      alert('Passwords do not match!');
    }
  }
}
