import { FormControl } from '@angular/forms';
import { containsMixedCharacters, passwordMatchValidator } from '../password-validators';

describe('containsMixedCharacters Validator', () => {
    const validatorFn = containsMixedCharacters();

    it('should return null for input with all required character types', () => {
        const control = new FormControl('Password1!');
        const result = validatorFn(control);
        expect(result).toBeNull(); // Valid input
    });

    it('should return error object if input is missing a lowercase letter', () => {
        const control = new FormControl('PASSWORD1!');
        const result = validatorFn(control);
        expect(result).toEqual({ containsMixedCharacters: true });
    });

    it('should return error object if input is missing an uppercase letter', () => {
        const control = new FormControl('password1!');
        const result = validatorFn(control);
        expect(result).toEqual({ containsMixedCharacters: true });
    });

    it('should return error object if input is missing a special character', () => {
        const control = new FormControl('Password1');
        const result = validatorFn(control);
        expect(result).toEqual({ containsMixedCharacters: true });
    });

    it('should return error object if input is missing a number', () => {
        const control = new FormControl('Password!');
        const result = validatorFn(control);
        expect(result).toEqual({ containsMixedCharacters: true });
    });
});


describe('passwordMatchValidator', () => {

    it('should return null if passwords match', () => {
        const mainPassword = new FormControl('Password123!');
        const confirmPassword = new FormControl('Password123!');
        const validatorFn = passwordMatchValidator(mainPassword);

        const result = validatorFn(confirmPassword);
        expect(result).toBeNull(); // Passwords match
    });

    it('should return error object if passwords do not match', () => {
        const mainPassword = new FormControl('Password123!');
        const confirmPassword = new FormControl('DifferentPassword!');
        const validatorFn = passwordMatchValidator(mainPassword);

        const result = validatorFn(confirmPassword);
        expect(result).toEqual({ passwordMismatch: true });
    });

    it('should handle changes in the main password dynamically', () => {
        const mainPassword = new FormControl('InitialPassword123!');
        const confirmPassword = new FormControl('InitialPassword123!');
        const validatorFn = passwordMatchValidator(mainPassword);

        // Initially matching
        let result = validatorFn(confirmPassword);
        expect(result).toBeNull();

        // Change main password
        mainPassword.setValue('NewPassword123!');
        result = validatorFn(confirmPassword);
        expect(result).toEqual({ passwordMismatch: true });

        // Update confirm password to match
        confirmPassword.setValue('NewPassword123!');
        result = validatorFn(confirmPassword);
        expect(result).toBeNull();
    });
});