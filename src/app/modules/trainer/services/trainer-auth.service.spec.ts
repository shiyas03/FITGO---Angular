import { TestBed } from '@angular/core/testing';

import { TrainerAuthService } from './trainer-auth.service';

describe('TrainerAuthService', () => {
  let service: TrainerAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainerAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
