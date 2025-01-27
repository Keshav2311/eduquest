import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn = false;
  private currentUser: any = null;

  constructor() {}

  login(user: any): void {
    this.isLoggedIn = true;
    this.currentUser = user;
    localStorage.setItem('users', JSON.stringify(user));
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('users')
  }

  isAuthenticated(): boolean {
      return localStorage.getItem('users')? true : false;
  }

  getUserRole(): string {
    if (!this.currentUser) {
      const user = JSON.parse(localStorage.getItem('users') || '{}');
      this.currentUser = user;
    }
    return this.currentUser?.role || '';
  }
}
