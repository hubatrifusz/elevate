import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccountPagePage } from './create-account-page.page';

describe('CreateAccountPagePage', () => {
  let component: CreateAccountPagePage;
  let fixture: ComponentFixture<CreateAccountPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
