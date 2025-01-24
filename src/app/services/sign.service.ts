import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignService {
  private apiUrl = 'http://localhost:3000/sign';
  constructor(private http: HttpClient) {}

  
  addItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  updatePassword(
    name: string,
    forgot: string,
    confirm: string
  ): Observable<any> {
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

        const updatedUser = { ...user, password: confirm };

        return this.http.put(url, updatedUser);
      }),

      catchError((error) => {
        console.error('Error occurred while updating Password:', error);
        return throwError(() => new Error('Failed to update Password.'));
      })
    );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
