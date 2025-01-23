import { Component } from '@angular/core';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: false,
  
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  users = {
    name: '',
    email: '',
  };

  constructor(private dataService: ContactService) {}
  onSubmit(contactForm: any) {
    this.dataService.addItem(this.users).subscribe(response => {
      console.log('Contact Detail Data added:', response);
    });

    contactForm.resetForm();
  }
}
