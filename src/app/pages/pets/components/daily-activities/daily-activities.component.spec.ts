import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyActivitiesComponent } from './daily-activities.component';

describe('DailyActivitiesComponent', () => {
  let component: DailyActivitiesComponent;
  let fixture: ComponentFixture<DailyActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
