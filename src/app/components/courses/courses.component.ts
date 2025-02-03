import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { SignService } from '../../services/sign.service';
import { AuthService } from '../../services/auth.service';
import * as Bootstrap from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  courses: any[] = []; // All courses fetched from API
  filteredCourses: any[] = []; // Filtered courses for display
  searchTerm: string = ''; // User search term
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
    this.role = this.authservice.getUserRole();

    const user = JSON.parse(localStorage.getItem('users') || '{}');
    if (user && user.courses) {
      this.enrolledCourses = new Set(user.courses);
    }
  }

  fetchCourses(): void {
    this.coursesService.getItem().subscribe({
      next: (data) => {
        this.courses = data; // Store full list
        this.filteredCourses = data; // Default filtered list is the same
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
    const user = JSON.parse(localStorage.getItem('users') || '{}');
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

    // Update user's courses list
    const updatedCourses = [...(user.courses || []), id];

    this.coursesService.getcourseById(id).subscribe({
      next: (data) => {
        this.trainerName = data.trainerName;
      },
      error: (err) => {
        console.error('Error fetching course details:', err);
      },
    });

    this.signservice.updateUser(userId, this.trainerName).subscribe({
      next: (response) => {
        console.log('Trainer name updated:', response);
      },
      error: (error) => {
        console.error('Error updating trainer name:', error);
      },
    });

    const updatedUserData = { ...user, courses: updatedCourses };
    console.log('Updated user data:', updatedUserData);

    this.signservice.updateUser(userId, updatedUserData).subscribe({
      next: (response) => {
        console.log('Enrollment successful:', response);
        Swal.fire({
          title: 'Enrollment Successful!',
          text: `You have successfully enrolled in ${courseName}.`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        });

        localStorage.setItem('users', JSON.stringify(updatedUserData));
        this.enrolledCourses.add(id);
      },
      error: (error) => {
        console.error('Error enrolling in the course:', error);
        alert('An error occurred while enrolling in the course.');
      },
    });
  }

  showDetails(course: any): void {
    this.selectedCourse = course;
    const modal = new Bootstrap.Modal(document.getElementById('detailsModal') as HTMLElement);
    modal.show();
  }
}
