import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  layoutService = inject(LayoutService);
  private readonly router = inject(Router);

  currentUser = signal<any>(null);

  // 🔥 Control del menú flotante
  isUserMenuOpen = signal<boolean>(false);

  ngOnInit(): void {
    const savedUser = localStorage.getItem('wasipet_user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  onToggleMenu() {
    this.layoutService.toggleSidebar();
  }

  // --- Métodos del Tooltip de Usuario ---
  toggleUserMenu() {
    this.isUserMenuOpen.update((val) => !val);
  }

  closeUserMenu() {
    this.isUserMenuOpen.set(false);
  }

  logout() {
    this.closeUserMenu();

    // Limpiamos el rastro del usuario en el navegador
    localStorage.removeItem('wasipet_user');
    // Si guardaste el token con otro nombre (ej. 'token' o 'wasipet_token'), bórralo aquí también
    localStorage.removeItem('wasipet_token');

    // Redirigimos a la pantalla de login
    this.router.navigate(['/login']);
  }
}
