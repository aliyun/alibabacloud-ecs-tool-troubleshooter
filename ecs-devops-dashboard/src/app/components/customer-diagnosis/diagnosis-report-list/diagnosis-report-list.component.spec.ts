import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosisReportListComponent } from './diagnosis-report-list.component';

describe('DiagnosisReportListComponent', () => {
  let component: DiagnosisReportListComponent;
  let fixture: ComponentFixture<DiagnosisReportListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiagnosisReportListComponent]
    });
    fixture = TestBed.createComponent(DiagnosisReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
