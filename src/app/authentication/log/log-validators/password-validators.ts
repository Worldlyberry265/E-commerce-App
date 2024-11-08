import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// Validator to check at least one lowercase, one uppercase, one special character, and one number
export function containsMixedCharacters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const hasLowerCase = /[a-z]/.test(value);
        const hasUpperCase = /[A-Z]/.test(value);
        const hasSpecialChar = /[!@#$%^*]/.test(value);
        const hasNumber = /\d/.test(value);

        if (hasLowerCase && hasUpperCase && hasSpecialChar && hasNumber) {
            return null; // Valid input
        } else {
            return { containsMixedCharacters: true }; // Invalid if any condition fails
        }
    };
}
// Check if the confirmation password matches the main password
export function passwordMatchValidator(mainPasswordControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        // Check if the confirmation password matches the main password
        return control.value === mainPasswordControl.value ? null : { passwordMismatch: true };
    };
}