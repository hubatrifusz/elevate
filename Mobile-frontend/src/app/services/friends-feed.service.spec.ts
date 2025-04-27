import { TestBed } from '@angular/core/testing';

import { FriendsFeedService } from './friends-feed.service';

describe('FriendsFeedService', () => {
  let service: FriendsFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendsFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
