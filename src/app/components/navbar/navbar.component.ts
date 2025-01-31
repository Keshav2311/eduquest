import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @ViewChild('drawer') drawer!: MatDrawer;


  constructor(public authService: AuthService, private router: Router) {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getDashboardLink(): string {
    const role = this.authService.getUserRole();
    return role === 'student' ? '/student' : role === 'instructor' ? '/instructor' : '/admin';
  }

  

  closeDrawer(): void {
    if (this.drawer) {
      this.drawer.close(); // Close only if the drawer exists
    }
  }
}
