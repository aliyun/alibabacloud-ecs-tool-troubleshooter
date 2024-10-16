import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceDiagnosisTaskDetailComponent } from './instance-diagnosis-task-detail.component';

describe('InstanceDiagnosisTaskDetailComponent', () => {
  let component: InstanceDiagnosisTaskDetailComponent;
  let fixture: ComponentFixture<InstanceDiagnosisTaskDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstanceDiagnosisTaskDetailComponent]
    });
    fixture = TestBed.createComponent(InstanceDiagnosisTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
