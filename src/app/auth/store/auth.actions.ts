import { createAction, props } from "@ngrx/store";


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
    // props<{emailNotFound : boolean}>()
);


