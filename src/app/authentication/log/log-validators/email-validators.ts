import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// Custom validator functions
export function startsWithLetter(): ValidatorFn {
    //retturns ValidationErros if the control isnt valid or null if it's valid
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return /^[a-zA-Z]/.test(value) ? null : { startsWithLetter: true }; // if the regex matches then it return null as it is valid, else it returns true as invalid
    };
}
// Doesn't allow double hyphens to decrease the chance of sql injections
export function noConsecutiveHyphens(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return /--/.test(value) ? { consecutiveHyphens: true } : null;
    };
}
// Checks if the part before the @ is btw 6 and 30 characters.
export function minLengthBeforeAt(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return /^[a-zA-Z][a-zA-Z0-9!@#$%^*.-_]{6,29}/.test(value) ? null : { minLengthBeforeAt: true }; 
    };
}
// Checks if the part after the @ in the email is valid
export function validDomainStructure(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return /@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/.test(value) ? null : { validDomainStructure: true };
    };
}



