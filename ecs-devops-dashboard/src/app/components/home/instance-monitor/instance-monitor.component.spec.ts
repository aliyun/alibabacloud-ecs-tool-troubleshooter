import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceMonitorComponent } from './instance-monitor.component';

describe('InstanceMonitorComponent', () => {
  let component: InstanceMonitorComponent;
  let fixture: ComponentFixture<InstanceMonitorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstanceMonitorComponent]
    });
    fixture = TestBed.createComponent(InstanceMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
