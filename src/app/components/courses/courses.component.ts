import { Component } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { SignService } from '../../services/sign.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-courses',
  standalone: false,
  
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  courses: any[] = []; // Array to hold courses fetched from the API
  selectedCourse: any | null = null;
  role: string = '';

  constructor(private coursesService: CoursesService, private signservice: SignService, private authservice: AuthService) {}

  ngOnInit(): void {
    this.fetchCourses();
    this.role = this.authservice.getUserRole();  
  }

  fetchCourses(): void {
    this.coursesService.getItem().subscribe({
      next: (data) => {
        this.courses = data; // Assign fetched data to the courses array
        console.log('Courses fetched:', this.courses);
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      },
    });
  }

  enroll(courseName: string, id: string): void {
    
    const user = JSON.parse(localStorage.getItem('users') || '{}'); // Retrieve user details
  const userId = user.id;

  if (!userId) {
    alert('User not logged in. Please login to enroll.');
    return;
  }

  // Update user's courses list
  const updatedCourses = [...(user.courses || []), id]; // Add the new course ID to the existing list

  const updatedUserData = {
    ...user,
    courses: updatedCourses, // Update the courses array
  };

  console.log('Updated user data:', updatedUserData);

  this.signservice.updateUser(userId, updatedUserData).subscribe({
    next: (response) => {
      console.log('Enrollment successful:', response);
      alert(`Successfully enrolled in ${courseName}!`);
      // Update localStorage with the updated user data
      localStorage.setItem('users', JSON.stringify(updatedUserData));
    },
    error: (error) => {
      console.error('Error enrolling in the course:', error);
      alert('An error occurred while enrolling in the course.');
    },
  });
    
  }

  showDetails(course: any): void {
    this.selectedCourse = course; // Set selected course details
    // const modal = new bootstrap.Modal(
    //   document.getElementById('detailsModal') as HTMLElement
    // );
    // modal.show();
  }
}
