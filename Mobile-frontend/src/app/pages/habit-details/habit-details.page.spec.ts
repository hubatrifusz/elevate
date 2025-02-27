import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HabitDetailsPage } from './habit-details.page';

describe('HabitDetailsPage', () => {
  let component: HabitDetailsPage;
  let fixture: ComponentFixture<HabitDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
