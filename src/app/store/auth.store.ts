import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { User } from '../models/User';
import { HttpClientService } from '../services/http/http.client.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { JwtDecodeService } from '../services/auth/jwt-decode.service';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserItemsStore } from './user-items.store';


type AuthState = {
    authError: string | null;
    loading: boolean;
    emailNotFound: boolean; // To know if the user needs to create an account or to Login
    jwt: string | null;
    username: string | null;
    lastRoute: string;
}

const initialState: AuthState = {
    authError: null,
    loading: false,
    emailNotFound: false,
    jwt: null,
    username: null,
    lastRoute: '/homepage' // since the homepage is our default page
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
    withMethods((store, httpClient = inject(HttpClientService), jwtDecoder = inject(JwtDecodeService), userItemsStore = inject(UserItemsStore),
        router = inject(Router)) => {

        function EmailLog(email: string): void {

            // This is the EmailLogStart action in the old approach
            patchState(store, { loading: true });

            //This is the EmailLogFail
            if (email.toLowerCase() === wrongEmail) {
                patchState(store, { authError: "Please check if the email address you've entered is correct." });
                // settimout to simulate sending an http request and waiting for its response
                setTimeout(() => {
                    patchState(store, (state) => ({ loading: !state.loading }))
                }, 1000);
            } else {
                // This is the EmailLogSuccess
                if (email.toLowerCase() === correctUser.email) {
                    // proceed to login
                    patchState(store, (state) => ({ emailNotFound: false, loading: !state.loading, authError: null }));
                } else {
                    // proceed to sign up
                    patchState(store, (state) => ({ emailNotFound: true, loading: !state.loading, authError: null }));
                }
            }
        }

        const PasswordLog = rxMethod<User>(
            pipe(
                tap(() => {
                    patchState(store, { loading: true });
                }),
                //All subsequent login requests are ignored until the current request finishes due to exhaustMap.
                // (However the user can only press it once at time due to the loading spinner displaying instead of the form in the log component)
                exhaustMap((user: User) => {
                    if (user.email.toLowerCase() === correctUser.email) {
                        //If the entered password is correct then fetch token
                        return of(SendLoginRequest({ usernameInputted: correctUser.username, passwordInputted: user.password }));
                        // else we return the generated error
                        // If the request timed out or there was no response, the HttpError.error will be an object
                    }
                    else {
                        // This is the case where we put any email that isnt found in the fakestoreApi, so it tries to sign up
                        // The fakestoreApi only returns an id upon success, so I login again with the correct dummy user to get a jwt
                        // We get the jwt to login the user automatically after signing up successfully.
                        return httpClient.postAddUser(user).pipe(
                            switchMap(({ id }) => {
                                return of(SendLoginRequest({ usernameInputted: correctUser.username, passwordInputted: correctUser.password }));
                                // This is the catchError for the login endpoint
                                // It wont trigger unless the request timeouted out or the server didnt respond because we are using the correct email and password
                                // It won't trigger in my case unless i made the browser offline
                                // That's why I'm putting a custom error such Request Timed Out
                            }),
                            // This is the catchError for the sign up endpoint
                            // It wont trigger unless the request timeouted out or the server didnt respond 
                            // Because the fakestoreapi doesnt return an error at all for this endpoint except if i dont put a json object and i did already.
                            // It won't trigger in my case unless i made the browser offline
                            // That's why I'm putting a custom error

                            catchError(() => {
                                return of(patchState(store, { loading: false, authError: "Request Timed Out" }))
                            })
                        )

                    }

                }
                )
            )
        );

        // Private Method
        const SendLoginRequest = rxMethod<{ usernameInputted: string, passwordInputted: string }>(
            pipe(
                switchMap(({ usernameInputted, passwordInputted }) => {
                    return httpClient.postLogin({ username: usernameInputted, password: passwordInputted }).pipe(
                        tapResponse({
                            //If the entered password is correct then fetch token
                            next: ({ token }) => {
                                const userName = jwtDecoder.fetchSubject(token);
                                localStorage.setItem('jwt', token);
                                patchState(store, { jwt: token, username: userName, loading: false, authError: null })

                                const [baseUrl, fragment] = store.lastRoute().split('#'); // Split into base URL and fragment
                                if (fragment) {
                                    router.navigate([baseUrl], { fragment: fragment });
                                } else {
                                    router.navigate([baseUrl]);
                                }
                            },
                            error: (HttpError: HttpErrorResponse) => {
                                let returnedError = HttpError.error;
                                if (typeof (returnedError) != 'string') {
                                    returnedError = "Request Timed Out";
                                }
                                patchState(store, { loading: false, authError: returnedError })
                            },
                        }),
                    );
                }),
            )
        );

        const ChangePassword = rxMethod<{ password: string, userId: number }>(
            pipe(
                tap(() => {
                    patchState(store, { loading: true });
                }),
                switchMap(({ password, userId }) => {
                    return httpClient.patchUpdateUser(password, userId).pipe(
                        tapResponse({
                            next: () => {
                                patchState(store, { loading: false, authError: null })
                                router.navigate([store.lastRoute()]);
                            },
                            error: (error: Error | HttpErrorResponse) => {
                                let errormsg = 'Request Timed Out';
                                if (error.message && (error.message == 'JWT is expired.' || error.message == 'JWT is invalid.')) {
                                    errormsg = 'Anything because then we have the the error hardcoded in the preview';
                                }
                                patchState(store, { loading: false, authError: errormsg });
                            }
                        }),
                    );
                }),
            )
        );

        function FetchJwtFromLocalStorage() {
            const jwtToken = localStorage.getItem('jwt');
            if (jwtToken) {
                const userName = jwtDecoder.fetchSubject(jwtToken);
                patchState(store, { jwt: jwtToken, username: userName })
            }
        };

        function SignOut() {
            // We delete the jwt to confirm the sign out and we return the default value to lastRoute to avoid the user going go a wrong route
            localStorage.removeItem('jwt');
            patchState(store, { jwt: null, username: null, lastRoute: '/homepage' })
            // We also have to update the UserItemsStore to remove all savedItems since the user isnt signed in anymore
            userItemsStore.DeleteSavedItems();
            router.navigate(['/login'], { fragment: 'logContainer' });
        };

        function SaveCurrentRoute(route: string) {
            patchState(store, { lastRoute: route });
        }

        return { EmailLog, PasswordLog, ChangePassword, FetchJwtFromLocalStorage, SignOut, SaveCurrentRoute }
    }),
    // withHooks({
    //     onInit({ FetchJwtFromLocalStorage }) {
    //         FetchJwtFromLocalStorage();
    //     }
    // }),
);

