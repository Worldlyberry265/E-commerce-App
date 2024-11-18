import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { User } from '../models/User';
import { HttpClientService } from '../services/http.client';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { PasswordLogFail } from '../auth/store/auth.actions';

type AuthState = {
    authError: string | null;
    loading: boolean;
    emailNotFound: boolean; // To know if the user needs to create an account or to Login
    jwt: string;
    userId: number | null;
}

const initialState: AuthState = {
    authError: null,
    loading: false,
    emailNotFound: false,
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
            patchState(store, (state) => ({ loading: !state.loading }));
            //This is the EmailLogFail
            if (email.toLowerCase() === wrongEmail) {
                // console.log(store.authError());
                // console.log("triggered from new store");
                patchState(store, {authError: "Please check if the email address you've entered is correct."});
                setTimeout(() => {
                    patchState(store, (state) => ({ loading : !state.loading}))
                }, 1000);
            } else {
                // This is the EmailLogSuccess
                if (email.toLowerCase() === correctUser.email) {
                    patchState(store, (state) => ({ emailNotFound : false , loading: !state.loading, authError: null }));
                } else {
                    patchState(store, (state) => ({ emailNotFound : true , loading: !state.loading, authError: null }));
                }
            }
        },
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


