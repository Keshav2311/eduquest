import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponentComponent } from './components/Home/home-component/home-component.component';
import { HeroComponent } from './components/Home/hero/hero.component';
import { AboutComponent } from './components/Home/about/about.component';
import { TrendCoursesComponent } from './components/Home/trend-courses/trend-courses.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';


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
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
