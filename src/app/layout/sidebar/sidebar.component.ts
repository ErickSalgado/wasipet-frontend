import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  layoutService = inject(LayoutService);

  private readonly router = inject(Router);

  logout() {

    localStorage.removeItem('wasipet_token');
    localStorage.removeItem('wasipet_user');

    this.router.navigate(['/login']);
  }
}
