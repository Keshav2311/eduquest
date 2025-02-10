import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { SignService } from '../../services/sign.service';
import { AuthService } from '../../services/auth.service';
import { Courseinterface } from '../../interfaces/courses';
import * as Bootstrap from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'] // Fixed typo
})
export class CoursesComponent implements OnInit {
  courses: Courseinterface[] = []; 
  filteredCourses: any[] = []; 
  searchTerm: string = ''; 
  selectedCourse: any | null = null;
  role: string = '';
  trainerName: string = '';
  enrolledCourses: Set<string> = new Set();

  constructor(
    private coursesService: CoursesService, 
    private signservice: SignService, 
    private authservice: AuthService
  ) {}

  

  ngOnInit(): void {
    this.fetchCourses();
    this.authservice.userRole$.subscribe((role) => {
      this.role = role;
    });

    const userData = localStorage.getItem('users');
    const user = userData ? JSON.parse(userData) : null;

    if (user && user.courses) {
      this.enrolledCourses = new Set(user.courses);
    }
  }

  fetchCourses(): void {
    this.coursesService.getItem().subscribe({
      next: (data) => {
        this.courses = data; 
        this.filteredCourses = data; 
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      },
    });
  }

  filterCourses(): void {
    this.filteredCourses = this.courses.filter(course =>
      course.courseName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      course.trainerName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  enroll(courseName: string, id: string): void {
    const userData = localStorage.getItem('users');
    const user = userData ? JSON.parse(userData) : null;
    const userId = user?.id;

    if (!userId) {
      Swal.fire({
        icon: 'warning',
        title: 'User Not Logged In',
        text: 'Please login to enroll.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if(user.role === 'instructor'){
      
    }

    if (this.enrolledCourses.has(id)) {
      Swal.fire({
        icon: 'info',
        title: 'Already Enrolled',
        text: `You are already enrolled in ${courseName}.`,
        confirmButtonText: 'OK',
      });
      return;
    }

    const updatedCourses = [...(user.courses || []), id];
    const updatedUserData = { ...user, courses: updatedCourses };

    this.signservice.updateUser(userId, updatedUserData).subscribe({
      next: () => {
        this.coursesService.getcourseById(id).subscribe({
          next: (course) => {
            const updatedStudents = course.students ? [...course.students] : [];

            if (!updatedStudents.includes(userId)) {
              updatedStudents.push(userId);
            }

            const updatedCourse = { ...course, students: updatedStudents };


            this.coursesService.updateCourse(id, updatedCourse).subscribe({
              next: () => {
                Swal.fire({
                  title: 'Enrollment Successful!',
                  text: `You have successfully enrolled in ${courseName}.`,
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#3085d6',
                });

                localStorage.setItem('users', JSON.stringify(updatedUserData));
                localStorage.setItem('courses', JSON.stringify(this.courses));
                this.enrolledCourses.add(id);
              },
              error: (courseError) => {
                console.error('Error updating course enrollment:', courseError);
                Swal.fire({
                  icon: 'error',
                  title: 'Enrollment Failed',
                  text: 'Could not update course enrollment.',
                  confirmButtonText: 'OK',
                });
              },
            });
          },
          error: (fetchError) => {
            console.error('Error fetching course details:', fetchError);
            Swal.fire({
              icon: 'error',
              title: 'Enrollment Failed',
              text: 'Could not retrieve course details.',
              confirmButtonText: 'OK',
            });
          },
        });
      },
      error: (userError) => {
        console.error('Error updating user enrollment:', userError);
        Swal.fire({
          icon: 'error',
          title: 'Enrollment Failed',
          text: 'Could not update user enrollment.',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  showDetails(course: any): void {
    this.selectedCourse = course;
    const modal = new Bootstrap.Modal(document.getElementById('detailsModal') as HTMLElement);
    modal.show();
  }
}
