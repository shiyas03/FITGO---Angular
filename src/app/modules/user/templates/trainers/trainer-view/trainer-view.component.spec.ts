import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerViewComponent } from './trainer-view.component';

describe('TrainerViewComponent', () => {
  let component: TrainerViewComponent;
  let fixture: ComponentFixture<TrainerViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerViewComponent]
    });
    fixture = TestBed.createComponent(TrainerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
