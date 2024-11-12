import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { User } from '../models/User';
import { HttpClientService } from '../services/http.client';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { PasswordLogFail } from '../auth/store/auth.actions';

type AuthState = {
    authError: string;
    loading: boolean;
    emailNotFound: boolean; // To know if the user needs to create an account or to Login
    jwt: string;
    userId: number | null;
}

const initialState: AuthState = {
    authError: 'error',
    loading: false,
    emailNotFound: true,
    jwt: '',
    userId: null,
};

// An exampe of an non-existent email to stimulate a server response
const wrongEmail = "wrong-email@icloud.com";

// After I finished developing my log component, it turned out in fakestoreapi they login in with the userame not the email
// thats why I'm putting username here isntead of only email and password.
const correctUser = {
    email: "william@gmail.com",
    username: "hopkins",
    password: "William56$hj"
};

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, httpClient = inject(HttpClientService)) => ({
        EmailLog(email: string): void {
            // This is the EmailLogStart action in the old approach
            patchState(store, (state) => ({ loading: true }));
            //This is the EmailLogFail
            if (email.toLowerCase() === wrongEmail) {
                console.log(store.authError());
                console.log("triggered from new store");
                setTimeout(() => {
                    patchState(store, (state) => ({ authError: "Please check if the email address you've entered is correct."  , loading : false}))
                }, 1000);
            } else {
                // This is the EmailLogSuccess
                if (email.toLowerCase() === correctUser.email) {
                    patchState(store, (state) => ({ emailNotFound : false , loading: false, authError: '' }));
                } else {
                    patchState(store, (state) => ({ emailNotFound : true , loading: false, authError: '' }));
                }
            }
        },
        ResetAnimationError() {
            patchState(store, (state) => ({authError: 'Error To not trigger the animation directly'}))
        }
        // PasswordLog: rxMethod<string>(
        //     pipe(
        //         tap(() => {
        //             patchState(store, { loading: true, error: null });
        //         }),
        //         // `email` here is the argument passed to `EmailLogStart` when called
        //         switchMap((email) =>
        //             httpClient.sendEmail(email).pipe(
        //                 tap({
        //                     next: () => patchState(store, { loading: false, error: null }),
        //                     error: (err) => {
        //                         patchState(store, { loading: false, error: err.message });
        //                     },
        //                 }),
        //                 catchError((error) => {
        //                     patchState(store, { loading: false, error: error.message });
        //                     return of(null);
        //                 })
        //             )
        //         )
        //     )
        // ),

    }))
);


