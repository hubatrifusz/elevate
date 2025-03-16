import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateHabitPage } from './create-habit.page';

describe('CreateHabitPage', () => {
  let component: CreateHabitPage;
  let fixture: ComponentFixture<CreateHabitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHabitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
