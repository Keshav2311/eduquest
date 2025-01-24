import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntructorComponent } from './intructor.component';

describe('IntructorComponent', () => {
  let component: IntructorComponent;
  let fixture: ComponentFixture<IntructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntructorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
