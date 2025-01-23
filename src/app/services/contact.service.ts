import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = 'http://localhost:3000/contacts';
  constructor(private http: HttpClient) {}
  addItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }
}
