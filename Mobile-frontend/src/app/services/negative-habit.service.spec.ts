import { TestBed } from '@angular/core/testing';

import { NegativeHabitService } from './negative-habit.service';

describe('NegativeHabitService', () => {
  let service: NegativeHabitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NegativeHabitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
