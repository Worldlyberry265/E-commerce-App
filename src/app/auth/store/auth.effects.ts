import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as AuthActions from './auth.actions';
import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from '../../store/app.reducer';
import { catchError, delay, map, of, switchMap, } from "rxjs";
import { HttpClientService } from "../../services/http.client";
import { JwtDecodeService } from "../../services/jwt-decode.service";

@Injectable()
export class AuthEffects {

    // An exampe of an non-existent email to stimulate a server response
    wrongEmail = "wrong-email@icloud.com";

    // After I finished developing my log component, it turned out in fakestoreapi they login in with the userame not the email
    // thats why I'm putting username here isntead of only email and password.
    correctUser = {
        email: "william@gmail.com",
        username: "hopkins",
        password: "William56$hj"
    };

    private $actions = inject(Actions);
    private httpClient = inject(HttpClientService)
    private jwtDecoder = inject(JwtDecodeService);
    // private store = inject(Store<fromApp.AppState>);

    emailLog = createEffect(() => this.$actions.pipe(
        ofType(AuthActions.EmailLogStart),
        switchMap(({ email }) => {
            if (email.toLowerCase() === this.wrongEmail) {
                return of(AuthActions.EmailLogFail({ errorMessage: "Please check if the email address you've entered is correct." }))
                    //im delaying the dispatch to replicate the waiting time of http responses
                    .pipe(delay(2000));
            } else {
                if (email.toLowerCase() === this.correctUser.email) {
                    return of(AuthActions.EmailLogSuccess({ emailNotFound: false }));
                } else {
                    return of(AuthActions.EmailLogSuccess({ emailNotFound: true }));
                }
            }
        })
    ));

    passwordLog = createEffect(() => this.$actions.pipe(
        ofType(AuthActions.PasswordLogStart),
        switchMap(({ user }) => {
            // This is the case where we login with the correct dummy user found in fakestoreApi to get the jwt 
            if (user.email.toLowerCase() === this.correctUser.email) {
                return this.httpClient.postLogin({ username: this.correctUser.username, password: user.password }).pipe(
                    map(({ token }) => {
                        const userId = this.jwtDecoder.fetchSubject(token);
                        return AuthActions.PasswordLogSuccess({ jwtToken: token, userId : userId })
                    }),
                    // We catch the error if we put a wrong password
                    // we use of to not cancel the flow of the effect
                    catchError((responseError) => {
                        return of(AuthActions.PasswordLogFail({ errorMessage: responseError.error }));
                    })
                );
            } else {
                // This is the case where we put any email that isnt found in the fakestoreApi, so it tries to sign up
                // The fakestoreApi only returns an id upon success, so I login again with the correct dummy user to get a jwt
                // We get the jwt to login the user automatically after signing up successfully.
                return this.httpClient.postAddUser(user).pipe(
                    switchMap((returnedId) => {
                        return this.httpClient.postLogin({ username: this.correctUser.username, password: this.correctUser.password }).pipe(
                            map(({ token }) => {
                                const userId = this.jwtDecoder.fetchSubject(token);
                                return AuthActions.PasswordLogSuccess({ jwtToken: token, userId : userId })
                            }),
                            // This is the catchError for the login endpoint
                            catchError((responseError) => {
                                return of(AuthActions.PasswordLogFail({ errorMessage: responseError.error }));
                            })
                        )
                    }),
                    // This is the catchError for the sign up endpoint
                    catchError((responseError) => {
                        return of(AuthActions.PasswordLogFail({ errorMessage: responseError.error }));
                    })
                );
            }
        }
        )

    ));

}
