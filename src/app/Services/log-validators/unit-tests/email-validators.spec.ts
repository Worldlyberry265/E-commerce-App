import { FormControl } from "@angular/forms";
import { minLengthBeforeAt, startsWithLetter, validDomainStructure } from "../email-validators";

describe('startsWithLetter Validator', () => {
    const validatorFn = startsWithLetter();

    it('should return null for valid input', () => {
        const control = new FormControl('ValidInput');
        const result = validatorFn(control);
        expect(result).toBeNull();
    });

    it('should return error object for input starting without a letter', () => {
        const control = new FormControl('!InvalidInput');
        const result = validatorFn(control);
        expect(result).toEqual({ startsWithLetter: true });
    });
});

describe('minLengthBeforeAt Validator', () => {
    const validatorFn = minLengthBeforeAt();

    it('should return null for valid input with 6-30 characters before @', () => {
        const control = new FormControl('abcdef@domain.com');
        const result = validatorFn(control);
        expect(result).toBeNull();
    });

    it('should return error object for input with less than 6 characters before @', () => {
        const control = new FormControl('cdef@domain.com');
        const result = validatorFn(control);
        expect(result).toEqual({ minLengthBeforeAt: true });
    });


    it('should return error object for input exceeding 30 characters before @', () => {
        const control = new FormControl('thisisaverylongemailaddressbeforetheat@domain.com');
        const result = validatorFn(control);
        expect(result).toEqual({ minLengthBeforeAt: true });
    });
});

describe('validDomainStructure Validator', () => {
    const validatorFn = validDomainStructure();

    it('should return null for a valid domain structure', () => {
        const control = new FormControl('user@domain.com');
        const result = validatorFn(control);
        expect(result).toBeNull();
    });

    it('should return error object for input without an @ symbol', () => {
        const control = new FormControl('userdomain.com');
        const result = validatorFn(control);
        expect(result).toEqual({ validDomainStructure: true });
    });

    it('should return error object for domain with invalid characters', () => {
        const control = new FormControl('user@domain#.com');
        const result = validatorFn(control);
        expect(result).toEqual({ validDomainStructure: true });
    });

    it('should return error object for missing TLD after dot', () => {
        const control = new FormControl('user@domain.');
        const result = validatorFn(control);
        expect(result).toEqual({ validDomainStructure: true });
    });

    it('should return error object for missing domain part before TLD', () => {
        const control = new FormControl('user@.com');
        const result = validatorFn(control);
        expect(result).toEqual({ validDomainStructure: true });
    });

    it('should return error object for input without a dot in the domain', () => {
        const control = new FormControl('user@domaincom');
        const result = validatorFn(control);
        expect(result).toEqual({ validDomainStructure: true });
    });

});