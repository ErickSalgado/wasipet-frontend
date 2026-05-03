import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyActivity } from '../../../../core/models/daily-activity.interface';

@Component({
  selector: 'app-daily-activity-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-activity-feed.component.html',
})
export class DailyActivityFeedComponent {
  // 🚪 Definimos las entradas y salidas que el padre está intentando usar
  activities = input<DailyActivity[]>([]);
  edit = output<DailyActivity>();
  delete = output<string>();

  // Helper para poner iconos bonitos según el tipo de actividad
  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      LLEGADA: 'login',
      COMIDA: 'restaurant',
      PASEO: 'directions_walk',
      BANO: 'shower',
      MEDICACION: 'medical_services',
      JUEGO: 'sports_soccer',
      SALIDA: 'logout',
      OTRO: 'sticky_note_2',
    };
    return icons[type] || 'event_note';
  }

  getBadgeClass(type: string): string {
    const classes: Record<string, string> = {
      LLEGADA: 'bg-emerald-100 text-emerald-700',
      COMIDA: 'bg-orange-100 text-orange-700',
      PASEO: 'bg-green-100 text-green-700',
      BANO: 'bg-blue-100 text-blue-700',
      MEDICACION: 'bg-red-100 text-red-700',
      SALIDA: 'bg-gray-100 text-gray-700',
    };
    return classes[type] || 'bg-gray-100 text-gray-700';
  }
}
