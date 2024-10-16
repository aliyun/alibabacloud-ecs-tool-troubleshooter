import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceDiagnosisListComponent } from './instance-diagnosis-list.component';

describe('InstanceDiagnosisListComponent', () => {
  let component: InstanceDiagnosisListComponent;
  let fixture: ComponentFixture<InstanceDiagnosisListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstanceDiagnosisListComponent]
    });
    fixture = TestBed.createComponent(InstanceDiagnosisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
