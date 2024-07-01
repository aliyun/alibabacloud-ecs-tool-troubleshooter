import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyBtnComponent } from './copy-btn.component';

describe('CopyBtnComponent', () => {
  let component: CopyBtnComponent;
  let fixture: ComponentFixture<CopyBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
