import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/sign';
      constructor(private http: HttpClient) {}

      getUsers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
      }
}
