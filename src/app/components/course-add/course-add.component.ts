import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-add',
  standalone: false,
  
  templateUrl: './course-add.component.html',
  styleUrl: './course-add.component.css'
})
export class CourseAddComponent {
  courseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]],
      trainerName: ['', [Validators.required, Validators.minLength(3)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      technologies: [[], Validators.required],
      courseFee: [null, [Validators.required, Validators.min(0)]],
      credits: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      trainerRemark: ['', [Validators.maxLength(250)]]
    });
  }

  // Add chip to technologies array
  addTechnology(event: Event): void {
    const input = event.target as HTMLInputElement; // Type casting to HTMLInputElement
    const technology = input.value.trim();
    const technologies = this.courseForm.get('technologies')?.value;
  
    if (technology && !technologies.includes(technology)) {
      technologies.push(technology);
      this.courseForm.get('technologies')?.setValue(technologies);
      input.value = ''; // Clear the input field
    }
  }

  // Remove chip from technologies array
  removeTechnology(technology: string): void {
    const technologies = this.courseForm.get('technologies')?.value;
    const index = technologies.indexOf(technology);
    if (index >= 0) {
      technologies.splice(index, 1);
      this.courseForm.get('technologies')?.setValue(technologies);
    }
  }

  // Submit the form
  onSubmit(): void {
    if (this.courseForm.valid) {
      console.log('Form Data:', this.courseForm.value);
      alert('Course submitted successfully!');
    } else {
      alert('Please correct the errors before submitting.');
    }
  }
}
