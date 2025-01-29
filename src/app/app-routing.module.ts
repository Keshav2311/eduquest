import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponentComponent } from './components/Home/home-component/home-component.component';
import { LoginComponent } from './components/login/login.component';
import { SignComponent } from './components/sign/sign.component';
import { ForgotComponent } from './components/login/forgot/forgot.component';
import { ContactComponent } from './components/contact/contact.component';
import { FaqComponent } from './components/faq/faq.component';
import { CoursesComponent } from './components/courses/courses.component';
import { StudentComponent } from './components/student/student.component';
import { IntructorComponent } from './components/intructor/intructor.component';
import { CourseAddComponent } from './components/course-add/course-add.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  { path: "", component: HomeComponentComponent }, 
  { path: "home", component: HomeComponentComponent },
  { path: "login", component: LoginComponent},
  { path: "signup", component: SignComponent},
  { path: "fogot", component: ForgotComponent},
  { path: "contact", component: ContactComponent},
  { path: "faq", component: FaqComponent},
  { path: "courses", component: CoursesComponent },
  { path: "student", component: StudentComponent},
  { path: "instructor", component: IntructorComponent},
  { path: "student", component: StudentComponent},
  { path: "admin", component: AdminComponent},
  { path: "course_add", component: CourseAddComponent}
];
// i fail
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
