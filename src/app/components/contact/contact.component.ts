import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: false,
  
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  user = {
    name: '',
    email: '',
  };

  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Form Submitted: ', this.user);
      alert('Thank you! We will get back to you.');
      form.reset();
    }
  }
}
