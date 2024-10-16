import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMetricSetComponent } from './modify-metric-set.component';

describe('ModifyMetricSetComponent', () => {
  let component: ModifyMetricSetComponent;
  let fixture: ComponentFixture<ModifyMetricSetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyMetricSetComponent]
    });
    fixture = TestBed.createComponent(ModifyMetricSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
