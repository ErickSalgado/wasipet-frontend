import { Component, inject, input, OnInit, signal } from '@angular/core';
import { DailyActivityService } from '../../../../core/services/daily-activity.service';
import { DailyActivity } from '../../../../core/models/daily-activity.interface';
import { DailyActivityFormComponent } from '../daily-activity-form/daily-activity-form.component';
import { DailyActivityFeedComponent } from '../daily-activity-feed/daily-activity-feed.component';

@Component({
  selector: 'app-daily-activities',
  standalone: true,
  imports: [DailyActivityFormComponent, DailyActivityFeedComponent],
  templateUrl: './daily-activities.component.html',
})
export class DailyActivitiesComponent implements OnInit {
  // Obligatorio: Recibe el ID del perrito desde el componente padre (Perfil de Mascota)
  petId = input.required<string>();

  private readonly activityService = inject(DailyActivityService);

  // Estado local usando Signals
  activities = signal<DailyActivity[]>([]);
  selectedActivity = signal<DailyActivity | null>(null);
  showForm = signal<boolean>(false);

  ngOnInit() {
    this.loadActivities();
  }

  loadActivities() {
    this.activityService.findByPet(this.petId()).subscribe({
      next: (data) => this.activities.set(data),
      error: (err) => console.error('Error cargando actividades', err),
    });
  }

  onSaveActivity(payload: Partial<DailyActivity>) {
    payload.petId = this.petId();
    const currentId = this.selectedActivity()?.id;
    if (currentId) {
      this.activityService.update(currentId, payload).subscribe(() => {
        this.loadActivities();
        this.closeForm();
      });
    } else {
      this.activityService.create(payload).subscribe(() => {
        this.loadActivities();
        this.closeForm();
      });
    }
  }

  onEditActivity(activity: DailyActivity) {
    this.selectedActivity.set(activity);
    this.showForm.set(true);
  }

  onDeleteActivity(id: string) {
    this.activityService.delete(id).subscribe(() => {
      this.loadActivities();
    });
  }

  openNewForm() {
    this.selectedActivity.set(null);
    this.showForm.set(true);
  }

  closeForm() {
    this.selectedActivity.set(null);
    this.showForm.set(false);
  }
}
