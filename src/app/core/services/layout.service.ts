import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  isCollapsed = true;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  closeOnMobile() {
    if (window.innerWidth < 1024) {
      this.isCollapsed = true;
    }
  }
}