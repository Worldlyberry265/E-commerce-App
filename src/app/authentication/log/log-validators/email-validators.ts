import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// Custom validator functions
export function startsWithLetter(): ValidatorFn {
    //retturns ValidationErros if the control isnt valid or null if it's valid
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return /^[a-zA-Z]/.test(value) ? null : { startsWithLetter: true }; // if the regex matches then it return null as it is valid, else it returns true as invalid
    };
}

export function noConsecutiveHyphens(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return /--/.test(value) ? { consecutiveHyphens: true } : null;
    };
}

export function minLengthBeforeAt(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        // Checks if the  1st 6 characters are from the following which are before the @
        return /^[a-zA-Z][a-zA-Z0-9!@#$%^*.-_]{5,}/.test(value) ? null : { minLengthBeforeAt: true }; 
    };
}

export function validDomainStructure(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return /@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/.test(value) ? null : { validDomainStructure: true };
    };
}



