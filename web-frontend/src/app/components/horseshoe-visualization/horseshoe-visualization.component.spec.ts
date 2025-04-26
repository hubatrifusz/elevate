import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorseshoeVisualizationComponent } from './horseshoe-visualization.component';

describe('HorseshoeVisualizationComponent', () => {
  let component: HorseshoeVisualizationComponent;
  let fixture: ComponentFixture<HorseshoeVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorseshoeVisualizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorseshoeVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
