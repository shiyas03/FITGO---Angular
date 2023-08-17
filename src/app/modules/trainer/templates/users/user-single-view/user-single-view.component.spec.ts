import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSingleViewComponent } from './user-single-view.component';

describe('UserSingleViewComponent', () => {
  let component: UserSingleViewComponent;
  let fixture: ComponentFixture<UserSingleViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSingleViewComponent]
    });
    fixture = TestBed.createComponent(UserSingleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
