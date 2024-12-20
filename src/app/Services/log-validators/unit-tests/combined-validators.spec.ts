import { FormControl } from '@angular/forms';
import { hasDesiredLength, noConsecutiveHyphens, noSpecialCharacters } from '../combined-validators';

describe('noSpecialCharacters Validator', () => {
    const validatorFn = noSpecialCharacters();

    it('should return null for valid input', () => {
        const control = new FormControl('allValidInput!@#%.-0_123');
        const result = validatorFn(control);
        expect(result).toBeNull();
    });

    it('should return error object for input with special characters', () => {
        const control = new FormControl('Invalid-{-Input!');
        const result = validatorFn(control);
        expect(result).toEqual({ noSpecialCharacters: true });
    });
});


describe('hasDesiredLength Validator', () => {
    const validatorFn = hasDesiredLength();

    it('should return null for input within desired length', () => {
        const control = new FormControl('ValidLength');
        const result = validatorFn(control);
        expect(result).toBeNull();
    });

    it('should return error object for input shorter than desired length', () => {
        const control = new FormControl('Short');
        const result = validatorFn(control);
        expect(result).toEqual({ hasDesiredLength: true });
    });

    it('should return error object for input longer than desired length', () => {
        const control = new FormControl('ThisInputIsWayWayWayWayWayWayTooLongToBeValid');
        const result = validatorFn(control);

        expect(result).toEqual({ hasDesiredLength: true });
    });
});

describe('noConsecutiveHyphens Validator', () => {
    const validatorFn = noConsecutiveHyphens();

    it('should return null for valid input', () => {
        const control = new FormControl('Valid-Input');
        const result = validatorFn(control);
        expect(result).toBeNull();
    });

    it('should return error object for input with consecutive hyphens', () => {
        const control = new FormControl('Invalid--Input');
        const result = validatorFn(control);
        expect(result).toEqual({ consecutiveHyphens: true });
    });
});