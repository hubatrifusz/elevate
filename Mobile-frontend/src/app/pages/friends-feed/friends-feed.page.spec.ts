import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FriendsFeedPage } from './friends-feed.page';

describe('FriendsFeedPage', () => {
  let component: FriendsFeedPage;
  let fixture: ComponentFixture<FriendsFeedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsFeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
