import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const requiredRole = route.data['role'];
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/auth']);
    }
    if (requiredRole) {
      const userRole = this.authService.getRole();
      if (userRole && userRole.toLowerCase() === requiredRole) {
        return true;
      } else {
        return this.router.createUrlTree(['/']); // ou une page d'erreur
      }
    }
    return true; // juste connecté suffit
  }
}
