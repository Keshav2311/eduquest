import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponentComponent } from './components/Home/home-component/home-component.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: "", component: HomeComponentComponent }, //default page
  { path: "login", component: LoginComponent}
];
// i fail
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
