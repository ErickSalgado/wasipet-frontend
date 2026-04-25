import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Vaccine } from '../models/vaccine.interface';

@Injectable({ providedIn: 'root' })
export class VaccineService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/vaccines`;

  // 🔥 Trae todas las vacunas de todas las mascotas
  getAllVaccines() {
    return this.http.get<Vaccine[]>(this.apiUrl);
  }

  // 🔥 Lo traemos de vuelta para el historial individual
  getVaccinesByPet(petId: string) {
    return this.http.get<Vaccine[]>(`${this.apiUrl}/pet/${petId}`);
  }

  // 🔥 Ya no le pasamos el petId por la URL, va dentro de "data"
  createVaccine(data: Partial<Vaccine>) {
    return this.http.post<Vaccine>(this.apiUrl, data);
  }

  updateVaccine(id: string, data: Partial<Vaccine>) {
    return this.http.patch<Vaccine>(`${this.apiUrl}/${id}`, data);
  }

  deleteVaccine(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
