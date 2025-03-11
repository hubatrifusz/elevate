import { TestBed } from '@angular/core/testing';

import { PasswordToggleService } from './password-toggle.service';

describe('PasswordToggleService', () => {
  let service: PasswordToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
