import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Una pequeña interfaz para que TypeScript sepa qué es un Cliente
export interface Client {
  id?: string;
  firstName: string;
  lastName: string;
  documentId?: string;
  documentType?: 'CEDULA' | 'RUC' | 'PASAPORTE' | 'OTRO';
  phone: string;
  secondaryPhone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly http = inject(HttpClient);
  // Usa la IP de tu backend si sigues en la red, o localhost
  private readonly apiUrl = 'http://localhost:3000/clients';

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  updateClient(id: string, client: Partial<Client>): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
