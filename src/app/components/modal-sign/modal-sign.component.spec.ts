import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSignComponent } from './modal-sign.component';

describe('ModalSignComponent', () => {
  let component: ModalSignComponent;
  let fixture: ComponentFixture<ModalSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalSignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
