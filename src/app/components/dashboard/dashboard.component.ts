import { Component, OnInit } from '@angular/core';
import { UserInterface } from '../../interfaces/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) { }

  userdata: UserInterface | null = null;
  dashboardmode = "login";

  ngOnInit() {
    console.log("hello");
    let user = JSON.parse(localStorage.getItem('users') || 'null');
    console.log(user);
    if (user) {
      this.dashboardmode = user.role;
      console.log(this.dashboardmode);
    }
    else {
      this.router.navigate(['/login'])
    }

  }
}
