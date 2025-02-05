import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material/material.module';


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
import { FaqComponent } from './components/faq/faq.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { CoursesComponent } from './components/courses/courses.component';
import { PartnersComponent } from './components/partners/partners.component';
import { ContactService } from './services/contact.service';
import{HttpClientModule}from'@angular/common/http';
import { StudentComponent } from './components/student/student.component';
import { SignService } from './services/sign.service';
import { IntructorComponent } from './components/intructor/intructor.component';
import { CoursesService } from './services/courses.service';
import { CourseAddComponent } from './components/course-add/course-add.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthService } from './services/auth.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { authReducer } from './reducer/auth.reducer';
import { N404Component } from './components/n404/n404.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';




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
    FaqComponent,
    TestimonialsComponent,
    CoursesComponent,
    PartnersComponent,
    StudentComponent,
    IntructorComponent,
    CourseAddComponent,
    AdminComponent,
    N404Component,
    DashboardComponent    
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreModule.forRoot({ auth: authReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    StoreRouterConnectingModule.forRoot()
    ],
  providers: [
    provideAnimationsAsync(),
    ContactService,
    SignService,
    CoursesService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
