import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Courseinterface } from '../interfaces/courses';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl = 'http://localhost:3000/courses';
  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/sign');
  }
  generateandput500items() {
    // console.log("helo");
    
    let rounds = 100;
    this.getUsers().subscribe(
      {
        next: (res) => {
          let tutorlist = res.filter((user) => user.role === 'instructor');


          let techlist = [
            "JavaScript", "Python", "Java", "C++", "Ruby", "Swift", "Kotlin", "Go", "Rust", "TypeScript",
            "HTML", "CSS", "SQL", "NoSQL", "Machine Learning", "Artificial Intelligence", "Blockchain", "Cybersecurity", "Cloud Computing", "DevOps"
          ];

          let trainerremarks = [
            "Excellent progress", "Needs improvement", "Great understanding", "Keep up the good work", "Struggling with concepts",
            "Outstanding performance", "Good participation", "Requires more practice", "Well done", "Can do better"
          ];

          let coursenme = [
            [
              "JavaScript", "Python", "Java", "C++", "Ruby", "Swift", "Kotlin", "Go", "Rust", "TypeScript",
              "HTML", "CSS", "SQL", "NoSQL", "Machine Learning", "Artificial Intelligence", "Blockchain", "Cybersecurity", "Cloud Computing", "DevOps"
            ],
            [
              "Beginner", "Intermediate", "Advanced", "Expert", "Novice", "Proficient", "Skilled", "Experienced", "Master", "Specialist",
              "Fundamental", "Basic", "Introductory", "Comprehensive", "Detailed", "Thorough", "In-depth", "Extensive", "Complete", "Full"
            ],
            [
              "Refresh", "Updated", "New", "Revised", "Enhanced", "Improved", "Modernized", "Upgraded", "Current", "Latest",
              "Contemporary", "Recent", "Advanced", "Innovative", "Cutting-edge", "State-of-the-art", "Leading-edge", "Up-to-date", "Novel", "Fresh"
            ]
          ];

          let durations = [3, 5, 6, 8, 12];
          let creditss = [5, 6, 7, 8, 9, 10];
          let coursefeess = [0, 50, 100, 200, 500, 800];

          for (let i = 0; i < rounds; i++) {

            function getRandomElement(arr: string | any[]) {
              return arr[Math.floor(Math.random() * arr.length)];
            }

            let randomTrainerRemark = getRandomElement(trainerremarks);
            let randomcredit = getRandomElement(creditss);

            let randomcoursefee = getRandomElement(coursefeess);

            let randomduration = getRandomElement(durations);
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

            let randomTechnologies = [];
            for (let i = 0; i < 4; i++) {
              randomTechnologies.push(getRandomElement(techlist));
            }

            let randomCourseName = `${getRandomElement(coursenme[0])} ${getRandomElement(coursenme[1])} ${getRandomElement(coursenme[2])}`;
            let trainernamee = getRandomElement(tutorlist).name;
            let randomimage = getRandomElement(imagePaths)
             let courseee: Courseinterface = {
              id: Date.now().toString(),
              imageUrl: randomimage,
              courseName: randomCourseName,
              duration: randomduration,
              technologies: randomTechnologies,
              courseFee: randomcoursefee,
              credits: randomcredit,
              trainerRemark: randomTrainerRemark,
              students: [],
              flag: true,
              trainerName: trainernamee
            }
            this.addItem(courseee).subscribe(res=>{})
          }

        }
      }
    )


  }

  addItem(item: any): Observable<any> {
    console.log(item);
    
    return this.http.post<any>(this.apiUrl, item);
  }

  getItem(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getcourseById(id: String): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getCourses(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteCourse(id: String): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  updateCourse(courseId: String, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${courseId}`, updatedData);
  }
}
