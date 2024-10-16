import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceDiagnosisTaskListComponent } from './instance-diagnosis-task-list.component';

describe('InstanceDiagnosisTaskListComponent', () => {
  let component: InstanceDiagnosisTaskListComponent;
  let fixture: ComponentFixture<InstanceDiagnosisTaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstanceDiagnosisTaskListComponent]
    });
    fixture = TestBed.createComponent(InstanceDiagnosisTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
