import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFeatureListComponent } from './login-feature-list.component';

describe('LoginFeatureListComponent', () => {
  let component: LoginFeatureListComponent;
  let fixture: ComponentFixture<LoginFeatureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFeatureListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginFeatureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
