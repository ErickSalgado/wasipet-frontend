import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Workspace } from '../../core/services/auth.service';

@Component({
  selector: 'app-workspace-selector',
  standalone: true,
  templateUrl: './workspace-selector.component.html',
  styleUrl: './workspace-selector.component.scss',
})
export class WorkspaceSelectorComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  currentUser = signal<any>(null);
  workspaces = signal<Workspace[]>([]); // Lista dinámica de sucursales
  selectedWorkspace = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    const savedUser = localStorage.getItem('wasipet_temp_user');
    const savedWorkspaces = localStorage.getItem('wasipet_workspaces');

    if (savedUser && savedWorkspaces) {
      this.currentUser.set(JSON.parse(savedUser));
      const parsedWorkspaces = JSON.parse(savedWorkspaces);
      this.workspaces.set(parsedWorkspaces);

      // Preseleccionar la primera por defecto
      if (parsedWorkspaces.length > 0) {
        this.selectedWorkspace.set(parsedWorkspaces[0].workspaceId);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  selectBranch(workspaceId: string): void {
    this.selectedWorkspace.set(workspaceId);
  }

  enterSystem(): void {
    const workspaceId = this.selectedWorkspace();
    const user = this.currentUser();

    if (!workspaceId || !user) return;

    this.isLoading.set(true);

    // 🔥 Llamamos al backend para obtener el Token final
    this.authService.selectWorkspace(user.id, workspaceId).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading.set(false);
        alert('Error al acceder a la sucursal');
      },
    });
  }
}
