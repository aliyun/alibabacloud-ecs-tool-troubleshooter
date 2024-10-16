import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceDiagnosisHeaderComponent } from './instance-diagnosis-header.component';

describe('InstanceDiagnosisHeaderComponent', () => {
  let component: InstanceDiagnosisHeaderComponent;
  let fixture: ComponentFixture<InstanceDiagnosisHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstanceDiagnosisHeaderComponent]
    });
    fixture = TestBed.createComponent(InstanceDiagnosisHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
