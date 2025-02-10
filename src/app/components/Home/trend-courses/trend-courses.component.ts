import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../../services/courses.service';
import { Courseinterface } from '../../../interfaces/courses';
import { AuthService } from '../../../services/auth.service';
import { SignService } from '../../../services/sign.service';
import * as Bootstrap from 'bootstrap';
import { Router } from '@angular/router';


@Component({
  selector: 'app-trend-courses',
  standalone: false,
  templateUrl: './trend-courses.component.html',
  styleUrls: ['./trend-courses.component.css']
})
export class TrendCoursesComponent implements OnInit {
  courses: Courseinterface[] = [];
  enrolledCourses: Set<string> = new Set();
  role: string = '';
  selectedCourse: any | null = null;


  constructor(private coursesService: CoursesService, private authservice: AuthService, private signservice: SignService, private route: Router) { }

  ngOnInit(): void {
    this.loadTrendingCourses();
    this.authservice.userRole$.subscribe((role) => {
      this.role = role;
    });

    const userData = localStorage.getItem('users');
    const user = userData ? JSON.parse(userData) : null;

    if (user && user.courses) {
      this.enrolledCourses = new Set(user.courses);
    }
  }

  loadTrendingCourses(): void {
    this.coursesService.getCourses().subscribe(
      (allCourses) => {
        const trendingCourses = allCourses.filter((course: any) => course.students?.length >= 2);
        this.courses = trendingCourses.slice(0, 4); // Only take the first 4
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  showDetails(course: any): void {
    this.selectedCourse = course;
    const modal = new Bootstrap.Modal(document.getElementById('detailsModal') as HTMLElement);
    modal.show();
  }
}

