import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { User } from '../models/User';
import { HttpClientService } from '../services/http.client';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, map, of, pipe, switchMap, tap } from 'rxjs';
import { JwtDecodeService } from '../services/jwt-decode.service';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


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

        PasswordLog: rxMethod<any>(
            pipe(
                tap(() => {
                    console.log("loading is on");
                    
                    patchState(store, { loading: true });
                }),
                //All subsequent login requests are ignored until the current request finishes due to exhaustMap.
                // (However the user can only press it once at time due to the loading spinner displaying instead of the form in the log component)
                exhaustMap((user: User) => {
                    if (user.email.toLowerCase() === correctUser.email) {

                        return httpClient.postLogin({ username: correctUser.username, password: user.password }).pipe(
                            tap( {
                                       
                                error(err) {
                                    console.log("FROM NEW STORE LOADINGGGGGGGGGG error");
                                    patchState(store, {loading: false}) 
                                    console.log(`authstore error inside errir ${store.authError()}`);
                                    
                                    
                                },
                            
                            }),
                            tapResponse({
                                //If the entered password is correct then fetch token
                                next: ({ token }) => {
                                    const userId = jwtDecoder.fetchSubject(token);
                                    patchState(store, { jwt: token, userId: userId })
                                    // console.log(" FROM NEW STORE PASS 2");
                                    // console.log(store.userId());
                                    // console.log(store.jwt());
                                    

                                    router.navigate(['/homepage']);

                                },
                                // else we return the generated token
                                error: (HttpError: HttpErrorResponse) => {
                                    // console.log("from new store errormessage : down");
                                    // console.log(" FROM NEW STORE PASS 3 BTW");

                                    console.log(HttpError.error);

                                    patchState(store, { authError: HttpError.error })
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
                                    tap( () => patchState(store, {loading: false}) ),
                                    tapResponse({
                                        next: ({ token }) => {
                                            // const userId = jwtDecoder.fetchSubject(token);
                                            patchState(store, { jwt: token, userId: id })
                                            console.log(store.userId());
                                            
                                            router.navigate(['/homepage']);

                                        },
                                        // This is the catchError for the login endpoint
                                        // It wont trigger unless the request timeouted out or the server didnt respond because we are using the correct email and password
                                        // It won't trigger in my case unless i made the browser offline
                                        // That's why I'm putting a custom error
                                        error: (errorMessage: HttpErrorResponse) => {
                                            console.log("from new store errormessage : down");

                                            console.log(errorMessage);

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
                            tap( () => patchState(store, {loading: false}) ),
                            catchError(() => {
                                return of(patchState(store, { authError: "Request Timed Out" }))
                            })
                        )

                    }

                }
                )
            )
        ),

        // AuthenticateUser: rxMethod<any>((source$: Observable<User>) => 
        //     source$.pipe(
        //       map(user => 
        //         httpClient.postLogin({ username: correctUser.username, password: user.password }).pipe(
        //           tapResponse({
        //             next: ({ token }) => {
        //               const userId = jwtDecoder.fetchSubject(token);
        //               patchState(store, { loading: false, jwt: token, userId: userId });
        //               router.navigate(['/homepage']);

        //             },
        //             error: (errorMessage: HttpErrorResponse) => {
        //               console.log("from new store errormessage : down");
        //               console.log(errorMessage);
        //               patchState(store, { loading: false, authError: errorMessage.message });
        //             }
        //           })
        //         )
        //       )
        //     )
        //   ),



        // return httpClient.postLogin({ username: correctUser.username, password: user.password }).pipe(
        //     tapResponse({
        //         next: ({ token }) => {
        //             const userId = jwtDecoder.fetchSubject(token);
        //             patchState(store, { loading: false, jwt: token, userId: userId })
        //             console.log(" FROM NEW STORE PASS 2");
        //             router.navigate(['/homepage']);

        //         },
        //         error: (errorMessage: HttpErrorResponse) => {
        //             console.log("from new store errormessage : down");
        //             console.log(" FROM NEW STORE PASS 3 BTW");

        //             console.log(errorMessage);

        //             patchState(store, { loading: false, authError: errorMessage.message })
        //         }
        //     }),
        // );
    })
    ),
);


// function AuthenticateUser(user: User, onSuccess: (token: string) => void, onError: (error: any) => void): Observable<void> {
//     return httpClient.post<{ token: string }>('login', { username: user.username, password: user.password }).pipe(
//         tap({
//             next: ({ token }) => onSuccess(token),
//             error: (error) => onError(error),
//         })
//     );
// }
