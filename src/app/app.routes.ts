import { Routes } from '@angular/router';
import { WorkspaceSelectorComponent } from './auth/workspace-selector/workspace-selector.component';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'workspace-selector',
    component: WorkspaceSelectorComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'clients',
        loadComponent: () => import('./pages/clients/clients.component').then(m => m.ClientsComponent),
      },
      {
        path: 'pets',
        loadComponent: () => import('./pages/pets/pets.component').then(m => m.PetsComponent),
      },
      {
        path: 'organizations',
        loadComponent: () => import('./pages/organizations/organizations.component').then(m => m.OrganizationsComponent),
      },
    ],
  },
];
