import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponentComponent } from './components/Home/home-component/home-component.component';
import { LoginComponent } from './components/login/login.component';
import { SignComponent } from './components/sign/sign.component';
import { ForgotComponent } from './components/login/forgot/forgot.component';
import { ContactComponent } from './components/contact/contact.component';

const routes: Routes = [
  { path: "", component: HomeComponentComponent }, 
  { path: "home", component: HomeComponentComponent },
  { path: "login", component: LoginComponent},
  { path: "signup", component: SignComponent},
  { path: "fogot", component: ForgotComponent},
  { path: "contact", component: ContactComponent}

];
// i fail
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
