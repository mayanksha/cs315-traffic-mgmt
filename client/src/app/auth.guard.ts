import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';
@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(
		private loginService: LoginService,
		private router: Router
	) {}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
			return this.loginService.checkLogin()
				.then((status: boolean) => {
					if (status) {
						return Promise.resolve(true);
					} else {
						this.router.navigate(['/login']);
						return Promise.resolve(false); }
				})
				.catch(err => Promise.reject(err));
		}
}
