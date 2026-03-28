import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Una pequeña interfaz para que TypeScript sepa qué es un Cliente
export interface Client {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly http = inject(HttpClient);
  // Usa la IP de tu backend si sigues en la red, o localhost
  private readonly apiUrl = 'http://localhost:3000/clients'; 

  // Obtener todos los clientes de mi sucursal
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  // Crear un nuevo cliente
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }
}