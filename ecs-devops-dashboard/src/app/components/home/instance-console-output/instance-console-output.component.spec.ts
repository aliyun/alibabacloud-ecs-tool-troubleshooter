import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceConsoleOutputComponent } from './instance-console-output.component';

describe('InstanceConsoleOutputComponent', () => {
  let component: InstanceConsoleOutputComponent;
  let fixture: ComponentFixture<InstanceConsoleOutputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstanceConsoleOutputComponent]
    });
    fixture = TestBed.createComponent(InstanceConsoleOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
