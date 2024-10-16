import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceMaintenanceAttrComponent } from './instance-maintenance-attr.component';

describe('InstanceMainenanceAttrComponent', () => {
  let component: InstanceMaintenanceAttrComponent;
  let fixture: ComponentFixture<InstanceMaintenanceAttrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstanceMaintenanceAttrComponent]
    });
    fixture = TestBed.createComponent(InstanceMaintenanceAttrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
