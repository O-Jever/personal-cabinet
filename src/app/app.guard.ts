import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from './services/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {
  constructor(private router: Router, private authorizationService: AuthorizationService) {}

   async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
      const isAuthenticated = await this.authorizationService.isAuthenticated();
      
      return isAuthenticated || this.router.parseUrl(`/authorization?return=${state.url}`);
  }
  
}
