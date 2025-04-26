import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateNegativeHabitPage } from './create-negative-habit.page';

describe('CreateNegativeHabitPage', () => {
  let component: CreateNegativeHabitPage;
  let fixture: ComponentFixture<CreateNegativeHabitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNegativeHabitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
