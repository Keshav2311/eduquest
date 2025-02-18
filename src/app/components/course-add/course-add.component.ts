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
  courseId: String | null = null;
  role: String | null = null;

  constructor(private fb: FormBuilder, private coursesService: CoursesService, private router: Router, private signservice: SignService, private route: ActivatedRoute) {
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]],
      trainerName: ['', [Validators.required, Validators.minLength(2)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      technologies: [[], Validators.required],
      courseFee: [null, [Validators.required, Validators.min(0)]],
      credits: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      trainerRemark: ['', [Validators.maxLength(250)]],
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
    let user = JSON.parse(localStorage.getItem('users') || '{}');
  
    if (!user || Object.keys(user).length === 0) {
      this.router.navigate(['/**']);
      return;
    }
  
    this.role = user.role;
  
    if (this.role === 'instructor') {
      this.route.paramMap.subscribe(params => {
        this.courseId = params.get('id');
        console.log('Course ID:', this.courseId);
        
        if (this.courseId) {
          this.coursesService.getcourseById(this.courseId).subscribe(course => {
            console.log("update will happen");
            this.courseForm.patchValue(course);
          });
        }
  
        // Ensure correct navigation using a **dynamic route**
        this.router.navigate([`/course_add/${this.courseId}`]);
      });
    } else {
      this.router.navigate(['/**']);
    }
  }
  

  onSubmit(): void {
    if (this.courseForm.valid) {
      const formData = this.courseForm.value;
  
      const imagePaths = [
        'assets/images/courses/image_1.webp',
        'assets/images/courses/image_2.webp',
        'assets/images/courses/image_3.webp',
        'assets/images/courses/image_4.webp',
        'assets/images/courses/image_5.webp',
        'assets/images/courses/image_6.webp',
        'assets/images/courses/image_7.webp',
        'assets/images/courses/image_8.webp'
      ];
  
      if (this.courseId) {
        // Update existing course
        this.coursesService.getcourseById(this.courseId).subscribe((existingCourse) => {
          if (!existingCourse) {
            console.error('Course not found.');
            Swal.fire({
              title: 'Error',
              text: 'Course not found.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
            return;
          }
  
          const updatedCourse = {
            ...existingCourse,
            ...formData // Merge updated values
          };
  
          if (this.courseId !== null && this.courseId !== undefined) {
            this.coursesService.getcourseById(this.courseId).subscribe((existingCourse) => {
              if (!existingCourse) {
                console.error('Course not found.');
                Swal.fire({
                  title: 'Error',
                  text: 'Course not found.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
                return;
              }
          
              const updatedCourse = {
                ...existingCourse,
                ...formData // Merge updated values
              };
          
              this.coursesService.updateCourse(this.courseId!, updatedCourse).subscribe({
                next: () => {
                  Swal.fire({
                    title: 'Updated!',
                    text: 'Course updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                  }).then(() => {
                    this.router.navigate(['/courses']);
                  });
                },
                error: (error) => {
                  console.error('Error updating course:', error);
                  Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while updating the course.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                  });
                }
              });
            });
          }
          
        });
      } else {
        // Create a new course
        formData.imageUrl = imagePaths[Math.floor(Math.random() * imagePaths.length)];
        formData.flag = true;
  
        this.coursesService.addItem(formData).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Submitted!',
              text: 'Course added successfully!',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              this.router.navigate(['/courses']);
            });
  
            let courseid = response.id;
            let tutorid = JSON.parse(localStorage.getItem('users') || '{}').id;
  
            this.signservice.addCourseToUser(courseid, tutorid).subscribe({
              next: () => console.log('Course added to user successfully'),
              error: (error) => console.error('Error adding course to user:', error)
            });
  
            this.courseForm.reset();
          },
          error: (error) => {
            console.error('Error submitting the course:', error);
            Swal.fire({
              title: 'Error',
              text: 'An error occurred while submitting the course.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        });
      }
    } else {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please correct the errors before submitting.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  }
  
}
