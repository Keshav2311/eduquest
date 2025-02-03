import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { logout } from '../../action/auth.action';
import { selectIsAuthenticated, selectUserRole } from '../../selector/auth.selector';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  dashboardLink$: Observable<string>;
  isStudent$: Observable<boolean>;

  constructor(private store: Store) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.isStudent$ = this.store.select(selectUserRole).pipe(
      map(role => role === 'student')  // Checks if the role is 'student'
    );
    this.dashboardLink$ = this.store.select(selectUserRole).pipe(
      map((role) => {
        switch (role) {
          case 'student': return '/student';
          case 'instructor': return '/instructor';
          case 'admin': return '/admin';
          default: return '/home';
        }
      })
    );
  }

  ngOnInit(): void {}

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
