import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noSpecialCharacters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value : string = control.value;
        // Allow only letters, digits, and !@#$%^*
        const validChars = /^[a-zA-Z0-9!@#$%^*-._]*$/;
        //extra validations because somehow the regex allows ; and =
        
        return (validChars.test(value) && !value.includes(';') && !value.includes('=')) ? null : { noSpecialCharacters: true };
    }
}
// Checks if the input is between 8 and 40 characters long
export function hasDesiredLength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value : string = control.value;
        return (value.length >= 8 && value.length <= 40) ? null : { hasDesiredLength: true };
    }
}