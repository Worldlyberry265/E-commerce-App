import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthStore } from '../../store/auth.store';
import { catchError, map } from 'rxjs/operators';
import { JwtDecodeService } from './jwt-decode.service';
import { MatDialog } from '@angular/material/dialog';
import { PreviewComponent } from '../../components/preview/preview.component';

@Injectable({
    providedIn: 'root',
})
export class JwtValidationGuard implements CanActivate {

    authStore = inject(AuthStore);
    jwtDecoder = inject(JwtDecodeService);
    router = inject(Router);
    readonly dialog = inject(MatDialog);


    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {

        const jwt = this.authStore.jwt();

        // If no JWT exists, deny access and redirect to login
        if (!jwt) {
            this.dialog.open(PreviewComponent, {
                panelClass: 'preview',
                data: { DialogType: 'Expired Jwt' }
            });
            return of(false);
        }

        // Check if the JWT is valid
        try {
            if (this.jwtDecoder.isJwtExpired(jwt)) {
                // If expired, redirect to login
                this.dialog.open(PreviewComponent, {
                    panelClass: 'preview',
                    data: { DialogType: 'Expired Jwt' }
                });
                return of(false);
            }
            return of(true); // JWT is valid, allow access to the route
        } catch (error) {
            // If there is an error in decoding, redirect to login
            this.dialog.open(PreviewComponent, {
                panelClass: 'preview',
                data: { DialogType: 'Expired Jwt' }
            });
            return of(false);
        }
    }
}
