import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SignService } from '../../services/sign.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course-add',
  standalone: false,
  templateUrl: './course-add.component.html',
  styleUrl: './course-add.component.css'
})
export class CourseAddComponent {
  courseForm: FormGroup;
  courseId: string | null = null;

  constructor(private fb: FormBuilder, private coursesService: CoursesService, private router: Router, private signservice: SignService, private route: ActivatedRoute) {
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]],
      trainerName: ['', [Validators.required, Validators.minLength(3)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      technologies: [[], Validators.required],
      courseFee: [null, [Validators.required, Validators.min(0)]],
      credits: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      trainerRemark: ['', [Validators.maxLength(250)]],
      imageUrl: ['', [Validators.required, Validators.pattern(/https?:\/\/.+\.(png|jpg|jpeg)/)]]
    });
  }

  addTechnology(event: Event): void {
    const input = event.target as HTMLInputElement; 
    const technology = input.value.trim();
    const technologies = this.courseForm.get('technologies')?.value;

    if (technology && !technologies.includes(technology)) {
      technologies.push(technology);
      this.courseForm.get('technologies')?.setValue(technologies);
      input.value = ''; 
    }
  }

  removeTechnology(technology: string): void {
    const technologies = this.courseForm.get('technologies')?.value;
    const index = technologies.indexOf(technology);
    if (index >= 0) {
      technologies.splice(index, 1);
      this.courseForm.get('technologies')?.setValue(technologies);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id');
      console.log('Course ID:', this.courseId);
      if (this.courseId) {
        this.coursesService.getcourseById(this.courseId).subscribe(course => {
          this.courseForm.patchValue(course);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const formData = this.courseForm.value;

      formData.imageUrl = 'assets/images/courses/mern.webp';

      if (this.courseId) {
        this.coursesService.updateCourse(this.courseId, formData).subscribe({
          next: () => {
            Swal.fire({
              title: 'Updated!',
              text: 'Course updated successfully!',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#28a745',
            });
          },
          error: (error) => {
            console.error('Error updating course:', error);
            alert('Error updating course.');
          }
        });
      }
      else {
        this.coursesService.addItem(formData).subscribe({
          next: (response) => {
            console.log('Course submitted successfully:', response);
            Swal.fire({
              title: 'Submitted!',
              text: 'Course Added successfully!',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#28a745',
            });
            console.log('Generated ID:', response.id);
            let courseid = response.id;
            let tutorid = JSON.parse(localStorage.getItem('users') || '').id;
            console.log(courseid, tutorid);
            this.signservice.addCourseToUser(courseid, tutorid).subscribe({
              next: () => {
                console.log('Course added to user successfully');
              },
              error: (error) => {
                console.error('Error adding course to user:', error);
                alert('Error adding course to user.');
              }
            });
            this.courseForm.reset(); 
            this.router.navigate(['/courses']);
          },
          error: (error) => {
            console.error('Error submitting the course:', error);
            alert('An error occurred while submitting the course.');
          }
        });
      }
    } else {
      alert('Please correct the errors before submitting.');
    }
  }
}
