import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendCoursesComponent } from './trend-courses.component';

describe('TrendCoursesComponent', () => {
  let component: TrendCoursesComponent;
  let fixture: ComponentFixture<TrendCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrendCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
