import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

export interface Workspace {
  workspaceId: string;
  organizationName: string;
  branchName: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // El login ahora devuelve el usuario y sus sucursales (Sin token aún)
  login(credentials: { email: string; password: string }) {
    return this.http
      .post<{
        user: any;
        workspaces: Workspace[];
      }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((res) => {
          // Guardamos temporalmente para que el WorkspaceSelector los use
          localStorage.setItem('wasipet_temp_user', JSON.stringify(res.user));
          localStorage.setItem(
            'wasipet_workspaces',
            JSON.stringify(res.workspaces),
          );
        }),
      );
  }

  // Nuevo método para confirmar la sucursal y obtener el JWT real
  selectWorkspace(userId: string, workspaceId: string) {
    return this.http
      .post<{
        access_token: string;
        user: any;
      }>(`${this.apiUrl}/select-workspace`, { userId, workspaceId })
      .pipe(
        tap((res) => {
          // ¡Ahora sí! Guardamos el token real y limpiamos la basura temporal
          localStorage.setItem('wasipet_token', res.access_token);
          localStorage.setItem('wasipet_user', JSON.stringify(res.user));
          localStorage.removeItem('wasipet_workspaces');
        }),
      );
  }
}
