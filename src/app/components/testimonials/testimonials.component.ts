import { Component, OnInit } from '@angular/core';
import { testimonialsInterface } from '../../interfaces/testimonials';
import { TestimonialService } from '../../services/testimonial.service';

@Component({
  selector: 'app-testimonials',
  standalone: false,
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent implements OnInit{

  testimonials : testimonialsInterface[] = [];
  activeIndex = 0;

  constructor(private testimonialService: TestimonialService) {}

  ngOnInit(): void {
    this.testimonialService.getTestimonials().subscribe({
      next: (data) =>{
        this.testimonials = data[0];
        console.log(data);
        this.autoslidechanger();
      },
      error: (err) =>{
        console.error("Error fetching testimonials:", err);
      }
    })
  }

  prevSlide() {
    this.activeIndex = (this.activeIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  nextSlide() {
    this.activeIndex = (this.activeIndex + 1) % this.testimonials.length;
  }

  autoslidechanger(){
    setInterval(() => {
      this.activeIndex=(this.activeIndex+1)% this.testimonials.length ;
      // console.log(this.activeIndex, this.testimonials[0])
    }, 3000);
  }

}
