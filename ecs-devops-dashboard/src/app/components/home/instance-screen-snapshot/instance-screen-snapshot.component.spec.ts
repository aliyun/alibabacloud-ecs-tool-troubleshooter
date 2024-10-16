import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceScreenSnapshotComponent } from './instance-screen-snapshot.component';

describe('InstanceScreenSnapshotComponent', () => {
  let component: InstanceScreenSnapshotComponent;
  let fixture: ComponentFixture<InstanceScreenSnapshotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstanceScreenSnapshotComponent]
    });
    fixture = TestBed.createComponent(InstanceScreenSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
