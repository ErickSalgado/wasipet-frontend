import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    // Esto te demostrará que el clic sí llega hasta aquí
    console.log('¿El menú está colapsado?:', this.isCollapsed); 
  }
}