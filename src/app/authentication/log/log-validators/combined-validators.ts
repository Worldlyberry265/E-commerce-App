import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noSpecialCharacters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value : string = control.value;
        // Allow only letters, digits, and !@#$%^*
        const validChars = /^[a-zA-Z0-9!@#$%^*.-_]*$/;
        //extra validations because somehow the regex allows ; and =
        return (validChars.test(value) && !value.includes(';') && !value.includes('=')) ? null : { noSpecialCharacters: true };
    }
}