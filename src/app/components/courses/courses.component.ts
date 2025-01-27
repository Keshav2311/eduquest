import { Component } from '@angular/core';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-courses',
  standalone: false,
  
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  courses: any[] = []; // Array to hold courses fetched from the API
  selectedCourse: any | null = null;

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.fetchCourses();
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

  enroll(courseName: string): void {
    
    // alert(`Enrolled in ${courseName}!`);
  }

  showDetails(course: any): void {
    this.selectedCourse = course; // Set selected course details
    // const modal = new bootstrap.Modal(
    //   document.getElementById('detailsModal') as HTMLElement
    // );
    // modal.show();
  }
}
