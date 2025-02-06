import { Component } from '@angular/core';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  users = {
    name: '',
    email: '',
  };

  private emailServiceId = 'service_tvhi55c';
  private emailTemplateId = 'template_ihf5yqt';
  private emailPublicKey = 'RMJjX39q_mx1XnoWJ';

  constructor() {}

  onSubmit(contactForm: any) {
    if (!this.users.name || !this.users.email) {
      Swal.fire({
        title: 'Incomplete Form!',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      });      
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.users.email)) {
      Swal.fire({
        title: 'Incomplete Form!',
        text: 'Please fill Valid Email.',
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      });      
      return;
    }

    const templateParams = {
      user_name: this.users.name,
      user_email: this.users.email,
    };

    emailjs
      .send(this.emailServiceId, this.emailTemplateId, templateParams, this.emailPublicKey)
      .then(
        (response: { status: number; text: string }) => {
          console.log('Email sent successfully!', response.status, response.text);
          Swal.fire({
            title: 'Form Completed Successfully!',
            text: 'Thank You for Contacting Us.',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
          });        },
        (error: any) => {
          console.error('Failed to send email:', error);
          alert('Oops! Something went wrong. Please try again later.');
        }
      );

    contactForm.resetForm();
  }
}
