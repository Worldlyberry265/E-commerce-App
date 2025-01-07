import { HttpInterceptorFn } from "@angular/common/http";
import { inject, } from "@angular/core";
import { throwError } from "rxjs";
import { AuthStore } from "../../store/auth.store";
import { JwtDecodeService } from "../auth/jwt-decode.service";

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const authStore = inject(AuthStore);
    const jwtDecoder = inject(JwtDecodeService);

    const jwt = authStore.jwt();

    // since the all requests requiring authorization can't be accessed unless the user is signed it/ has jwt
    if (!jwt) {
        return next(req);
    }

    const authHeader = req.headers.get('Authorization');

    if (authHeader) {
        try {
            // If the jwt is expired we throw an error
            if (jwtDecoder.isJwtExpired(jwt)) {
                return throwError(() => new Error('JWT is expired.'));
            }
            // If we got a problem while fetching and testing the jwt, we throw an error
        } catch (error) {
            return throwError(() => new Error('JWT is invalid.'));
        }
    }

    // Clone the request to add the real Authorization header
    const clonedReq = req.clone({
        // Add the jwt after the confirmation of its validity
        headers: req.headers.set('Authorization', `Bearer ${jwt}`),
    });

    // Pass the cloned request to the next handler
    return next(clonedReq);
};
