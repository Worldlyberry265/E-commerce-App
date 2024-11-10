import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as AuthActions from './auth.actions';
import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from '../../store/app.reducer';
import { of, switchMap, } from "rxjs";

@Injectable()
export class AuthEffects {

    wrongEmail = "wrong-email@icloud.com";

    private $actions = inject(Actions);
    // private store = inject(Store<fromApp.AppState>);

    authLog = createEffect ( () => this.$actions.pipe(
        ofType(AuthActions.EmailLogStart),
        switchMap( ({email}) => {
            if(email.toLowerCase() === this.wrongEmail) {
                return of(AuthActions.EmailLogFail({ errorMessage: "Please check if the email address you've entered is correct." }));
            } else {
                return of(AuthActions.EmailLogSuccess());
            }
        } )
    ));

}