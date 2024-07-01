import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEventComponent } from './customer-event.component';

describe('CustomerEventComponent', () => {
  let component: CustomerEventComponent;
  let fixture: ComponentFixture<CustomerEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerEventComponent]
    });
    fixture = TestBed.createComponent(CustomerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
