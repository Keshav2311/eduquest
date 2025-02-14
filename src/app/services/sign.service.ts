import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { CoursesService } from './courses.service';

@Injectable({
  providedIn: 'root',
})
export class SignService {
  private apiUrl = 'http://localhost:3000/sign';
  constructor(private http: HttpClient, private courseservice: CoursesService) {}

  
  addItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  updatePassword(
    name: string,
    forgot: string,
    confirm: string
  ): 
  Observable<any> {
    console.log(`New Password: ${forgot}, Confirm Password: ${confirm}`);

    return this.getUsers().pipe(
      map((data: any[]) => {
        console.log(data);

        const user = data.find((item: any) => item.name === name);

        if (!user) {
          throw new Error('User with given name not found.');
        }

        console.log(`User found: ${JSON.stringify(user)}`);

        return user;
      }),

      switchMap((user: any) => {
        const url = `${this.apiUrl}/${user.id}`;
        console.log(`Updating user at URL: ${url}`);

        const updatedUser = { ...user, password: confirm };//spread operator

        return this.http.put(url, updatedUser);
      }),

      catchError((error) => {
        console.error('Error occurred while updating Password:', error);
        return throwError(() => new Error('Failed to update Password.'));
      })
    );
  }

  addCourseToUser(courseId: string, userId: string): Observable<any> {
    console.log("started");

    return this.http.get<any>(this.apiUrl+"/"+userId).pipe(
      switchMap(userdata => {
        debugger;
        console.log("reached here, userdata is :",userdata)
        const userCourses = userdata.courses || [];
        const updatedCourses = [...userCourses, courseId ];
        console.log(updatedCourses);
        userdata.courses = updatedCourses;
        console.log("updated");
        return this.http.put(`${this.apiUrl}/${userId}`, userdata);
      })
    );
  }
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserById(id: String): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getUserByName(name: String): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${name}`);
  }

  updateUser(userId: String, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, updatedData); // Adjust URL as needed
  }

  deleteUser(userId: String): Observable<any> {
    let user = this.getUserById(userId);
    let courses = user.pipe(map((data: any) => data.courses));
    courses.subscribe((data) => {
      data.forEach((courseId: string) => {
        this.courseservice.deleteCourse(courseId).subscribe({
          next: (res) => {
            console.log('Course deleted successfully!', res);
          },
          error: (err) => {
            console.error('There was an error!', err);
          },
        });
      });
    });
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }
  
}
