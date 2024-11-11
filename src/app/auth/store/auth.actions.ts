import { createAction, props } from "@ngrx/store";
import { User } from "../../models/User";


export const EmailLogStart = createAction(
    '[Auth] Email Log Start',
    props<{email : string }>()
);

export const EmailLogFail = createAction(
    '[Auth] Email Log Fail',
    props<{errorMessage : string}>()
);

export const EmailLogSuccess = createAction(
    '[Auth] Email Log Success',
    props<{emailNotFound : boolean}>()
);

export const PasswordLogStart = createAction(
    '[Auth] Password Log Start',
    props<{user : User}>()
);

export const PasswordLogFail = createAction(
    '[Auth] Password Log Fail',
    props<{errorMessage : string}>()
);

export const PasswordLogSuccess = createAction(
    '[Auth] Password Log Success',
    props<{ jwtToken : string , userId : number}>()
);


