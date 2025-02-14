import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SignService } from '../../services/sign.service';
import { UserInterface } from '../../interfaces/user';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign',
  standalone: false,
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css'],
})
export class SignComponent {
  step = 1;
  signupForm: FormGroup;
  user: UserInterface | undefined;

  constructor(private fb: FormBuilder, private signService: SignService, private router: Router) {
    this.signupForm = this.fb.group({
      page1: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
      }),
      page2: this.fb.group({
        role: ['', Validators.required],
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
      }
      else {
        this.signupForm.get('page2.experience')?.setValidators([
          Validators.required,
          Validators.pattern('^(201[0-9]|202[0-5])$')        
        ]);
      }
      this.signupForm.get('page2.experience')?.updateValueAndValidity();
    });
  }

  nextStep(): void {
    if (this.isCurrentPageValid()) {
      this.step++;
    }
  }

  previousStep(): void {
    this.step--;
  }

  isCurrentPageValid(): boolean {
    const currentGroup = this.getCurrentPageGroup();
    return currentGroup.valid;
  }

  getCurrentPageGroup(): FormGroup {
    return this.signupForm.get(`page${this.step}`) as FormGroup;
  }

  ngOnInit() {
    const luser = localStorage.getItem('users');
    if (luser != null) {
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

  onSubmit(): void {
    const { password, confirmPassword } = this.signupForm.get('page3')?.value;
    if (password === confirmPassword) {
      const formData = {
        ...this.signupForm.get('page1')?.value,
        ...this.signupForm.get('page2')?.value,
        ...this.signupForm.get('page3')?.value,
      };

      delete formData.confirmPassword;
      formData.active = true;
      console.log(formData);

      this.signService.addItem(formData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Thank You For Signing in!',
            text: 'Sign-IN Successful!',
            icon: 'success',
            confirmButtonText: 'Continue',
            confirmButtonColor: '#28a745',
          });
          this.signupForm.reset();
          this.router.navigate(["/home"]);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to submit the form. Please try again.');
        },
      });
    }
    else {
      Swal.fire({
        title: 'Error!',
        text: 'Passwords do not match!',
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#d33',
      });
    }
  }
}
