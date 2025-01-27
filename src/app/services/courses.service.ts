import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl = 'http://localhost:3000/courses';
    constructor(private http: HttpClient) {}
  
    
    addItem(item: any): Observable<any> {
      return this.http.post<any>(this.apiUrl, item);
    }

    getItem(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }
    getcourseById(id: String): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    deleteCourse(id: String): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
