import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponentComponent } from './components/Home/home-component/home-component.component';
import { HeroComponent } from './components/Home/hero/hero.component';
import { AboutComponent } from './components/Home/about/about.component';
import { TrendCoursesComponent } from './components/Home/trend-courses/trend-courses.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { SignComponent } from './components/sign/sign.component';
import { ForgotComponent } from './components/login/forgot/forgot.component';
import { ContactComponent } from './components/contact/contact.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginDialogComponent } from './components/Login/login-dialog/login-dialog.component';
import { FaqComponent } from './components/faq/faq.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { CoursesComponent } from './components/courses/courses.component';
import { PartnersComponent } from './components/partners/partners.component';
import { ContactService } from './services/contact.service';
import{HttpClientModule}from'@angular/common/http';
import { StudentComponent } from './components/student/student.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponentComponent,
    HeroComponent,
    AboutComponent,
    TrendCoursesComponent,
    FooterComponent,
    LoginComponent,
    SignComponent,
    ForgotComponent,
    ContactComponent,
    LoginDialogComponent,
    FaqComponent,
    TestimonialsComponent,
    CoursesComponent,
    PartnersComponent,
    StudentComponent
    
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
    ],
  providers: [
    provideAnimationsAsync(),
    ContactService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
