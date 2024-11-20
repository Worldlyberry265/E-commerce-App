import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { User } from '../models/User';
import { HttpClientService } from '../services/http.client';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { JwtDecodeService } from '../services/jwt-decode.service';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


type AuthState = {
    authError: string | null;
    loading: boolean;
    emailNotFound: boolean; // To know if the user needs to create an account or to Login
    jwt: string | null;
    username: string | null;
}

const initialState: AuthState = {
    authError: null,
    loading: false,
    emailNotFound: false,
    jwt: null,
    username: null,
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
    withMethods((store, httpClient = inject(HttpClientService), jwtDecoder = inject(JwtDecodeService), router = inject(Router)) => ({

        EmailLog(email: string): void {

            // This is the EmailLogStart action in the old approach
            patchState(store, { loading: true });

            //This is the EmailLogFail
            if (email.toLowerCase() === wrongEmail) {
                patchState(store, { authError: "Please check if the email address you've entered is correct." });
                setTimeout(() => {
                    patchState(store, (state) => ({ loading: !state.loading }))
                }, 1000);
            } else {
                // This is the EmailLogSuccess
                if (email.toLowerCase() === correctUser.email) {
                    patchState(store, (state) => ({ emailNotFound: false, loading: !state.loading, authError: null }));
                } else {
                    patchState(store, (state) => ({ emailNotFound: true, loading: !state.loading, authError: null }));
                }
            }
        },

        PasswordLog: rxMethod<User>(
            pipe(
                tap(() => {
                    patchState(store, { loading: true });
                }),
                //All subsequent login requests are ignored until the current request finishes due to exhaustMap.
                // (However the user can only press it once at time due to the loading spinner displaying instead of the form in the log component)
                exhaustMap((user: User) => {
                    if (user.email.toLowerCase() === correctUser.email) {
                        return httpClient.postLogin({ username: correctUser.username, password: user.password }).pipe(
                            tap({
                                error() {
                                    patchState(store, { loading: false })
                                },

                            }),
                            tapResponse({
                                //If the entered password is correct then fetch token
                                next: ({ token }) => {
                                    const userName = jwtDecoder.fetchSubject(token);
                                    localStorage.setItem('jwt', token);
                                    patchState(store, { jwt: token, username: userName, loading: false, authError: null })
                                    router.navigate(['/homepage']);
                                },
                                // else we return the generated token
                                error: (HttpError: HttpErrorResponse) => {
                                    let returnedError = HttpError.error;
                                    // If the request timed out or there was no response, the HttpError.error will be an object
                                    if (typeof (returnedError) != 'string') {
                                        returnedError = "Request Timed Out";
                                    }
                                    patchState(store, { authError: returnedError })
                                },
                            }),
                        );
                    }
                    else {
                        // This is the case where we put any email that isnt found in the fakestoreApi, so it tries to sign up
                        // The fakestoreApi only returns an id upon success, so I login again with the correct dummy user to get a jwt
                        // We get the jwt to login the user automatically after signing up successfully.
                        return httpClient.postAddUser(user).pipe(
                            switchMap(({ id }) => {
                                return httpClient.postLogin({ username: correctUser.username, password: correctUser.password }).pipe(
                                    tap(() => patchState(store, { loading: false })),
                                    tapResponse({
                                        next: ({ token }) => {
                                            const userName = jwtDecoder.fetchSubject(token);
                                            localStorage.setItem('jwt', token);
                                            patchState(store, { jwt: token, username: userName, authError: null })
                                            router.navigate(['/homepage']);

                                        },
                                        // This is the catchError for the login endpoint
                                        // It wont trigger unless the request timeouted out or the server didnt respond because we are using the correct email and password
                                        // It won't trigger in my case unless i made the browser offline
                                        // That's why I'm putting a custom error
                                        error: (errorMessage: HttpErrorResponse) => {
                                            patchState(store, { authError: "Request Timed Out" })
                                        }
                                    }),
                                )
                            }),
                            // This is the catchError for the sign up endpoint
                            // It wont trigger unless the request timeouted out or the server didnt respond 
                            // Because the fakestoreapi doesnt return an error at all for this endpoint except if i dont put a json object and i did already.
                            // It won't trigger in my case unless i made the browser offline
                            // That's why I'm putting a custom error
                            tap({
                                error() {
                                    patchState(store, { loading: false })
                                },
                            }),
                            catchError(() => {
                                return of(patchState(store, { authError: "Request Timed Out" }))
                            })
                        )

                    }

                }
                )
            )
        ),

        FetchJwtFromLocalStorage() {
            const jwtToken = localStorage.getItem('jwt');
            if (jwtToken) {
                const userName = jwtDecoder.fetchSubject(jwtToken);
                patchState(store, { jwt: jwtToken, username: userName })
            }
        },

        DeleteJwt() {
            localStorage.removeItem('jwt');
            patchState(store, { jwt: null, username: null })
            router.navigate(['/login']);
        },
    })
    ),
);
