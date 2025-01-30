import { Component } from '@angular/core';
import Swal from 'sweetalert2';

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
      Swal.fire({
        title: 'Subscribed!',
        text: `Thank you for subscribing, ${this.email}!`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745',
      });
      form.reset(); // Reset the form after submission
    }
  }
}
