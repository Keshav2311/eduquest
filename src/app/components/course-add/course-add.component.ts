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
    // this.coursesService.generateandput500items();
    let user = JSON.parse(localStorage.getItem('users') || '{}');
    if(user === null){
      this.router.navigate(['/**'])
    }
    this.role = user.role;
    if(this.role === 'instructor'){
      this.router.navigate(['course_add']);
    }
    else{
      this.router.navigate(['/**']);
    }
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

      if (!this.courseId) {
        formData.imageUrl = imagePaths[Math.floor(Math.random() * imagePaths.length)];
        formData.flag = true;
        console.log(formData.imageUrl);
      }
      if (this.courseId) {
        const courseId: string = this.courseId; // Ensure it's a string

        this.coursesService.getcourseById(courseId).subscribe((existingCourse) => {
          if (!existingCourse) {
            console.error('Course not found.');
            alert('Error: Course not found.');
            return;
          }

          const formData = {
            ...this.courseForm.value,
            students: existingCourse.students || [],
            imageUrl: existingCourse.imageUrl
          };

          this.coursesService.updateCourse(courseId, formData).subscribe({
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
            this.router.navigate(['/courses']);
            this.courseForm.reset();
          },
          error: (error) => {
            console.error('Error submitting the course:', error);
            alert('An error occurred while submitting the course.');
          }
        });
      }
    } 
    else {
      alert('Please correct the errors before submitting.');
    }
  }
}
