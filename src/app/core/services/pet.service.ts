import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pet } from '../models/pet.interface';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/pets`;

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.apiUrl);
  }

  findAllActive(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/active`);
  }

  getPetById(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`);
  }

  createPet(pet: Pet): Observable<Pet> {
    const { id, client, ...payload } = pet;
    return this.http.post<Pet>(this.apiUrl, payload);
  }

  updatePet(id: string, pet: Partial<Pet>): Observable<Pet> {
    const { id: _, client, ...payload } = pet;
    return this.http.patch<Pet>(`${this.apiUrl}/${id}`, payload);
  }

  deletePet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
