import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowWorkoutComponent } from './show-workout.component';

describe('ShowWorkoutComponent', () => {
  let component: ShowWorkoutComponent;
  let fixture: ComponentFixture<ShowWorkoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowWorkoutComponent]
    });
    fixture = TestBed.createComponent(ShowWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
