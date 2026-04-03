import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Client } from '../models/client.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly http = inject(HttpClient);
  // Usa la IP de tu backend si sigues en la red, o localhost
  private readonly apiUrl = `${environment.apiUrl}/clients`;

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: string, client: Partial<Client>): Observable<Client> {
    const { id: _, ...payload } = client;
    return this.http.patch<Client>(`${this.apiUrl}/${id}`, payload);
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
