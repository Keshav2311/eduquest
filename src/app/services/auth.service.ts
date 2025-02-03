import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { login, logout } from '../action/auth.action';
import { selectIsAuthenticated, selectUserRole } from '../selector/auth.selector';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated$: Observable<boolean>;
  userRole$: Observable<string>;

  constructor(private store: Store) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.userRole$ = this.store.select(selectUserRole);
  }

  login(user: any): void {
    this.store.dispatch(login({ user }));
  }

  logout(): void {
    this.store.dispatch(logout());
  }
}
