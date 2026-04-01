import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl || 'http://localhost:3000/auth';

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        // Guardamos el token y los datos del usuario en el navegador
        localStorage.setItem('wasipet_token', res.access_token);
        localStorage.setItem('wasipet_user', JSON.stringify(res.user));
      })
    );
  }
}