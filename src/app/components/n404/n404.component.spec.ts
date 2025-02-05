import { ComponentFixture, TestBed } from '@angular/core/testing';

import { N404Component } from './n404.component';

describe('N404Component', () => {
  let component: N404Component;
  let fixture: ComponentFixture<N404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [N404Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(N404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
