import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DailyActivity } from '../models/daily-activity.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class DailyActivityService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/daily-activities`;

  findByPet(petId: string) {
    return this.http.get<DailyActivity[]>(`${this.apiUrl}/pet/${petId}`);
  }
  create(data: Partial<DailyActivity>) {
    return this.http.post<DailyActivity>(this.apiUrl, data);
  }
  update(id: string, data: Partial<DailyActivity>) {
    return this.http.patch<DailyActivity>(`${this.apiUrl}/${id}`, data);
  }
  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
