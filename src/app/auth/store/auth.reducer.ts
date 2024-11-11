import { createReducer, on } from "@ngrx/store";
import { User } from "../../models/User";
import * as AuthActions from "./auth.actions";

export interface State {
    authError: string;
    loading: boolean;
    emailNotFound : boolean; // To know if the user needs to create an account or to Login
    jwt : string;
    userId : number | null;
};

const initialState: State = {
    authError: '',
    loading: false,
    emailNotFound: true,
    jwt: '',
    userId: null,
};

export const authReducer = createReducer(
    initialState,

    on(AuthActions.EmailLogStart, (state, {email}) => {
        return {
            ...state,
            loading: true,
        }
    }),

    on(AuthActions.EmailLogFail, (state, payload) => {
        console.log("fail triggered");
        
        return {
            ...state,
            loading: false,
            authError : payload.errorMessage
        }
    }),

    on(AuthActions.EmailLogSuccess, (state, {emailNotFound}) => {
        return {
            ...state,
            loading: false,
            authError : '',
            emailNotFound : emailNotFound
        }
    }),

    on(AuthActions.PasswordLogStart, (state) => {
        return {
            ...state,
            loading: true,
        }
    }),

    on(AuthActions.PasswordLogFail, (state, {errorMessage}) => {
        return {
            ...state,
            loading: false,
            authError : errorMessage
        }
    }),

    on(AuthActions.PasswordLogSuccess, (state, {jwtToken, userId}) => {
        console.log(`From reducer userId: ${userId}`);
        
        return {
            ...state,
            loading: false,
            authError: '',
            jwt: jwtToken,
            userId: userId,
        }
    }),
    
    
   

);
    

            