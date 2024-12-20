// jwt-decode.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { JwtDecodeService, JwtDecodeWrapper } from './jwt-decode.service';

describe('JwtDecodeService', () => {
    let service: JwtDecodeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [JwtDecodeService],
        });
        service = TestBed.inject(JwtDecodeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch the user from JWT payload', () => {
        const mockJwtToken = 'mock.jwt.token';
        const mockDecodedPayload = { sub: 1, user: 'testuser', iat: 1234567890 };

        // Spy on the jwtDecode method of the wrapper
        spyOn(JwtDecodeWrapper, 'jwtDecode').and.returnValue(mockDecodedPayload);

        const username = service.fetchSubject(mockJwtToken);

        // Ensure that jwtDecode was called with the provided JWT token
        expect(JwtDecodeWrapper.jwtDecode).toHaveBeenCalledWith(mockJwtToken);

        // Check that the returned username matches the expected value
        expect(username).toBe('testuser');
    });

    it('should throw error for invalid JWT', () => {
        const invalidToken = 'invalid.token';

        // Simulate an error when jwtDecode is called with an invalid token
        spyOn(JwtDecodeWrapper, 'jwtDecode').and.throwError('Invalid token');

        // Test that an error is thrown
        expect(() => service.fetchSubject(invalidToken)).toThrowError('Invalid token');
    });
});
