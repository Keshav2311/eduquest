import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  email: string = '';

  onSubscribe(form: any): void {
    if (form.valid) {
      console.log('Subscribed email:', this.email);
      alert(`Thank you for subscribing, ${this.email}!`);
      form.reset(); // Reset the form after submission
    }
  }
}
