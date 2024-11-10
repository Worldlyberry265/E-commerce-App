import { createReducer, on } from "@ngrx/store";
import { User } from "../../models/User";
import * as AuthActions from "./auth.actions";


const dummyUser : User = {
email : "william@gmail.com",
password: "William56$hj"
};


export interface State {
    user: User | null;
    authError: string;
    loading: boolean;
    emailNotFound : boolean; // To know if the user needs to create an account or to Login
    jwt : string;
};

const initialState: State = {
    user: null,
    authError: '',
    loading: false,
    emailNotFound: true,
    jwt: ''
};

export const authReducer = createReducer(
    initialState,

    // any to decrease to not put an extra condition to check if it's null.
    on(AuthActions.EmailLogStart, (state, {email}) => {
        let isEmailNotFound : boolean;
        if(email.toLowerCase() === dummyUser.email) {
            isEmailNotFound = false;
        } else {
            isEmailNotFound = true;
        }
        return {
            ...state,
            loading: true,
            emailNotFound : isEmailNotFound
        }
    }),

    on(AuthActions.EmailLogFail, (state, payload) => {
        return {
            ...state,
            loading: false,
            authError : payload.errorMessage
        }
    }),

    on(AuthActions.EmailLogSuccess, (state) => {
        return {
            ...state,
            loading: false,
            authError : '',
            emailNotFound : false
        }
    }),
    
   

);
    

            