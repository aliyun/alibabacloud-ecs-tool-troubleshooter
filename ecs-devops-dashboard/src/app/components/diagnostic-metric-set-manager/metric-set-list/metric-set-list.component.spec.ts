import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricSetListComponent } from './metric-set-list.component';

describe('MetricSetListComponent', () => {
  let component: MetricSetListComponent;
  let fixture: ComponentFixture<MetricSetListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetricSetListComponent]
    });
    fixture = TestBed.createComponent(MetricSetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
