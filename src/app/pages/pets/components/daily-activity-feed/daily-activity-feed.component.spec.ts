import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyActivityFeedComponent } from './daily-activity-feed.component';

describe('DailyActivityFeedComponent', () => {
  let component: DailyActivityFeedComponent;
  let fixture: ComponentFixture<DailyActivityFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyActivityFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyActivityFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
