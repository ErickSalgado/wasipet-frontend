import { Component, OnInit, inject, signal } from '@angular/core';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  layoutService = inject(LayoutService);

  currentUser = signal<any>(null);

  ngOnInit(): void {
    const savedUser = localStorage.getItem('wasipet_user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  onToggleMenu() {
    this.layoutService.toggleSidebar();
  }
}
