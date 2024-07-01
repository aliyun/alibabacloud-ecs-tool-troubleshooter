import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDiagnosisComponent } from './customer-diagnosis.component';

describe('CustomerDiagnosisComponent', () => {
  let component: CustomerDiagnosisComponent;
  let fixture: ComponentFixture<CustomerDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDiagnosisComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
