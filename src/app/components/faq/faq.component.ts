import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: false,
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const buttons = document.querySelectorAll<HTMLButtonElement>('.faq-toggle');

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.parentElement) {
          button.parentElement.classList.toggle('active');
        }
      });
    });
  }
}
