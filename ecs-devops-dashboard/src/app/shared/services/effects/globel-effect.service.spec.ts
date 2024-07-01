import { TestBed } from '@angular/core/testing';

import { GlobalEffectService } from './global-effect.service';

describe('GlobalEffectService', () => {
  let service: GlobalEffectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalEffectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
