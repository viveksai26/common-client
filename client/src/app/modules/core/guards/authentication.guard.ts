import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RoutePathConstant } from '../../shared/constants/route-path-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuardService implements CanActivate {
  constructor(private router: Router, private authService: SocialAuthService) {}

  canActivate(): Observable<any> {
    return this.authService.authState.pipe(
      tap((data) => console.log(data)),
      map((data) => {
        if (data) {
          return true;
        } else {
          this.router.navigate([RoutePathConstant.ROUTE_LOGIN]);
          return false;
        }
      }),
      catchError((error) => {
        console.log(error);
        this.router.navigate([RoutePathConstant.ROUTE_LOGIN]);
        return of(false);
      })
    );
  }
}
