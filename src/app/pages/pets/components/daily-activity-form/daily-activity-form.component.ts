import { Component, inject, input, output, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DailyActivity } from '../../../../core/models/daily-activity.interface';

@Component({
  selector: 'app-daily-activity-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './daily-activity-form.component.html',
})
export class DailyActivityFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  // Entradas y salidas
  activity = input<DailyActivity | null>(null);
  save = output<Partial<DailyActivity>>();
  cancelForm = output<void>();

  // ✅ ERROR 1 Y 3 SOLUCIONADOS: Definimos TODOS los controles, incluyendo activityDate
  activityForm = this.fb.nonNullable.group({
    activityType: ['COMIDA', [Validators.required]],
    timestamp: [this.getCurrentDateTime(), [Validators.required]], // 🔥 Cambiado aquí
    description: ['', [Validators.required]],
    photoUrl: [''],
  });

  ngOnInit() {
    const currentAct = this.activity();
    if (currentAct) {
      this.activityForm.patchValue({
        activityType: currentAct.activityType as any,
        description: currentAct.description,
        photoUrl: currentAct.photoUrl || '',
        // 🔥 Cambiado aquí
        timestamp: currentAct.timestamp
          ? this.formatDateForInput(currentAct.timestamp)
          : this.getCurrentDateTime(),
      });
    }
  }

  // ✅ ERROR 2 SOLUCIONADO: Las funciones helper ya están dentro de la clase
  private getCurrentDateTime(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  private formatDateForInput(dateString: string): string {
    const d = new Date(dateString);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  onSubmit() {
    if (this.activityForm.valid) {
      const formValue = this.activityForm.getRawValue();
      const payload: Partial<DailyActivity> = {
        activityType: formValue.activityType as any,
        description: formValue.description,
        // 🔥 Cambiado aquí
        timestamp: new Date(formValue.timestamp).toISOString(),
      };
      if (formValue.photoUrl) payload.photoUrl = formValue.photoUrl;
      this.save.emit(payload);
    }
  }
}
