import { Routes } from '@angular/router';
import { WorkspaceSelectorComponent } from './auth/workspace-selector/workspace-selector.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'workspace-selector',
        component: WorkspaceSelectorComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    }
];
