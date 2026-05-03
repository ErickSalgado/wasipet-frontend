import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyActivityFormComponent } from './daily-activity-form.component';

describe('DailyActivityFormComponent', () => {
  let component: DailyActivityFormComponent;
  let fixture: ComponentFixture<DailyActivityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyActivityFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
