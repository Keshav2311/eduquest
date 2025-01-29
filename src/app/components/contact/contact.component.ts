import { Component } from '@angular/core';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'] // Fixed typo from "styleUrl" to "styleUrls"
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
    // Validate the form
    if (!this.users.name || !this.users.email) {
      alert('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.users.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Prepare the template parameters
    const templateParams = {
      user_name: this.users.name,
      user_email: this.users.email,
    };

    // Send the email using Email.js
    emailjs
      .send(this.emailServiceId, this.emailTemplateId, templateParams, this.emailPublicKey)
      .then(
        (response: { status: number; text: string }) => {
          console.log('Email sent successfully!', response.status, response.text);
          alert('Thank you for subscribing! We’ve sent a confirmation to your email.');
        },
        (error: any) => {
          console.error('Failed to send email:', error);
          alert('Oops! Something went wrong. Please try again later.');
        }
      );

    // Reset the form
    contactForm.resetForm(); // If using NgForm
  }
}
