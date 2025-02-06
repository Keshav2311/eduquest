import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { testimonialsInterface } from '../interfaces/testimonials';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {

  private jsonUrl = 'http://localhost:3000/testimonials';

  constructor(private http: HttpClient) {}

  getTestimonials(): Observable<any[]> {
    return this.http.get<any[]>(this.jsonUrl);
  }
}
