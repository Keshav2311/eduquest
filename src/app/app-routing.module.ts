import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponentComponent } from './components/Home/home-component/home-component.component';
import { LoginComponent } from './components/login/login.component';
import { SignComponent } from './components/sign/sign.component';
import { ForgotComponent } from './components/login/forgot/forgot.component';
import { ContactComponent } from './components/contact/contact.component';
import { FaqComponent } from './components/faq/faq.component';
import { CoursesComponent } from './components/courses/courses.component';
import { CourseAddComponent } from './components/course-add/course-add.component';
import { N404Component } from './components/n404/n404.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TrendCoursesComponent } from './components/Home/trend-courses/trend-courses.component';

const routes: Routes = [
  { path: "", component: HomeComponentComponent }, 
  { path: "home", component: HomeComponentComponent },
  { path: "login", component: LoginComponent},
  { path: "signup", component: SignComponent},
  { path: "fogot", component: ForgotComponent},
  { path: "contact", component: ContactComponent},
  { path: "faq", component: FaqComponent},
  { path: "courses", component: CoursesComponent },
  { path: "course_add", component: CourseAddComponent},
  { path: "course_add/:id", component: CourseAddComponent},
  { path: 'dashboard', component:DashboardComponent},
  { path: 'tending_courses', component: TrendCoursesComponent},
  { path: '**', component: N404Component}

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
