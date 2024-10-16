import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDistributionComponent } from './event-distribution.component';

describe('EventDistributionComponent', () => {
  let component: EventDistributionComponent;
  let fixture: ComponentFixture<EventDistributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventDistributionComponent]
    });
    fixture = TestBed.createComponent(EventDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
