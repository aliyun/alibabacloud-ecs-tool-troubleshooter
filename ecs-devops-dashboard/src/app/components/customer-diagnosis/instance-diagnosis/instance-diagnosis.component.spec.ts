import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceDiagnosisComponent } from './instance-diagnosis.component';

describe('InstanceDiagnosisComponent', () => {
  let component: InstanceDiagnosisComponent;
  let fixture: ComponentFixture<InstanceDiagnosisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstanceDiagnosisComponent]
    });
    fixture = TestBed.createComponent(InstanceDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
