import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyPageComponent } from './empty-page.component';

describe('EmptyPageComponent', () => {
  let component: EmptyPageComponent;
  let fixture: ComponentFixture<EmptyPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyPageComponent]
    });
    fixture = TestBed.createComponent(EmptyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
