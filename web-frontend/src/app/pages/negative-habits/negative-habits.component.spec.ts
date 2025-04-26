import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegativeHabitsComponent } from './negative-habits.component';

describe('NegativeHabitsComponent', () => {
  let component: NegativeHabitsComponent;
  let fixture: ComponentFixture<NegativeHabitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NegativeHabitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NegativeHabitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
