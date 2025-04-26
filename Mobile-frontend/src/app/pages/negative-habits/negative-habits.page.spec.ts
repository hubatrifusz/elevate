import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NegativeHabitsPage } from './negative-habits.page';

describe('NegativeHabitsPage', () => {
  let component: NegativeHabitsPage;
  let fixture: ComponentFixture<NegativeHabitsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NegativeHabitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
