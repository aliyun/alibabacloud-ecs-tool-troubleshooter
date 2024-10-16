import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDistributionComponent } from './resource-distribution.component';

describe('ResourceDistributionComponent', () => {
  let component: ResourceDistributionComponent;
  let fixture: ComponentFixture<ResourceDistributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceDistributionComponent]
    });
    fixture = TestBed.createComponent(ResourceDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
