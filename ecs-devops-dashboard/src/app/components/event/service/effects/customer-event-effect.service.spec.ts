import { TestBed } from '@angular/core/testing';
import {CustomerEventEffectService} from "./customer-event-effect.service";


describe('CustomerEventEffectService', () => {
  let service: CustomerEventEffectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerEventEffectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
