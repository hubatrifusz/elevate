import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegativeHabitComponent } from './negative-habit.component';

describe('NegativeHabitComponent', () => {
  let component: NegativeHabitComponent;
  let fixture: ComponentFixture<NegativeHabitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NegativeHabitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NegativeHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
