import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisReportComponent } from './diagnosis-report.component';

describe('DiagnosisReportComponent', () => {
  let component: DiagnosisReportComponent;
  let fixture: ComponentFixture<DiagnosisReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiagnosisReportComponent]
    });
    fixture = TestBed.createComponent(DiagnosisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
