import { Routes } from '@angular/router';
import { WorkspaceSelectorComponent } from './auth/workspace-selector/workspace-selector.component';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PetsComponent } from './pages/pets/pets.component';
import { ClientsComponent } from './pages/clients/clients.component';

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
        component: DashboardComponent,
      },
      {
        path: 'clients',
        component: ClientsComponent,
      },
      {
        path: 'pets',
        component: PetsComponent,
      },
    ],
  },
];
