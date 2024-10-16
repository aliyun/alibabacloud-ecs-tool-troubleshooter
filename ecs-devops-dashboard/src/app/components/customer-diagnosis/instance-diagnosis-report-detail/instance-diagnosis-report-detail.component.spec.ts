import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceDiagnosisReportDetailComponent } from './instance-diagnosis-report-detail.component';

describe('InstanceDiagnosisReportDetailComponent', () => {
  let component: InstanceDiagnosisReportDetailComponent;
  let fixture: ComponentFixture<InstanceDiagnosisReportDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstanceDiagnosisReportDetailComponent]
    });
    fixture = TestBed.createComponent(InstanceDiagnosisReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
