import {Routes} from '@angular/router';
import {AuthGuard} from './services/auth.guard';
import {LandingPage} from './components/landing-page/landing-page';
import {VehicleSearch} from './components/vehicle-search/vehicle-search';

export const routes: Routes = [
  { path: '',
    component: LandingPage
  },
  {
    path: 'vehicules', component: VehicleSearch
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth').then(m => m.Auth)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin').then(m => m.Admin),
    canActivate: [AuthGuard],
    data: {role: 'admin'}
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/user/user').then(m => m.UserComponent),
    canActivate: [AuthGuard]
  }
];
