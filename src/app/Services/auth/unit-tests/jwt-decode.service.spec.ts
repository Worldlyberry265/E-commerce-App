// jwt-decode.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { JwtDecodeService, JwtDecodeWrapper } from '../jwt-decode.service';

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

    it('should fetch the Id from JWT payload', () => {
        const mockJwtToken = 'mock.jwt.token';
        const mockDecodedPayload = { sub: 3, user: 'testuser', iat: 1234567890 };

        // Spy on the jwtDecode method of the wrapper
        spyOn(JwtDecodeWrapper, 'jwtDecode').and.returnValue(mockDecodedPayload);

        const userId = service.fetchId(mockJwtToken);

        // Ensure that jwtDecode was called with the provided JWT token
        expect(JwtDecodeWrapper.jwtDecode).toHaveBeenCalledWith(mockJwtToken);

        // Check that the returned username matches the expected value
        expect(userId).toBe(3);
    });

    it('should fetch the GeneratedDate from JWT payload', () => {
        const mockJwtToken = 'mock.jwt.token';
        const mockDecodedPayload = { sub: 3, user: 'testuser', iat: 1234567890 };

        // Spy on the jwtDecode method of the wrapper
        spyOn(JwtDecodeWrapper, 'jwtDecode').and.returnValue(mockDecodedPayload);

        const iat = service.fetchGeneratedDate(mockJwtToken);

        // Ensure that jwtDecode was called with the provided JWT token
        expect(JwtDecodeWrapper.jwtDecode).toHaveBeenCalledWith(mockJwtToken);

        // Check that the returned username matches the expected value
        expect(iat).toBe(1234567890);
    });

    describe('isJwtExpired', () => {

        it('should return true if JWT is expired', () => {
            const mockJwtToken = 'mock.jwt.token';
            const mockDecodedPayload = { sub: 1, user: 'testuser', iat: 10000 };

            spyOn(JwtDecodeWrapper, 'jwtDecode').and.returnValue(mockDecodedPayload);
            spyOn(Date, 'now').and.returnValue(100000000); // Simulate current time to be past the iat time

            const isExpired = service.isJwtExpired(mockJwtToken);

            expect(isExpired).toBeTrue();
        });

        it('should return false if JWT is not expired', () => {
            const mockJwtToken = 'mock.jwt.token';
            const mockDecodedPayload = { sub: 1, user: 'testuser', iat: 100000000 };

            spyOn(JwtDecodeWrapper, 'jwtDecode').and.returnValue(mockDecodedPayload);
            // Simulate the current time to be earlier than the iat one
            spyOn(Date, 'now').and.returnValue(10000);

            const isExpired = service.isJwtExpired(mockJwtToken);

            expect(isExpired).toBeFalse();
        });
    });


    it('should throw error for invalid JWT', () => {
        const invalidToken = 'invalid.token';

        // Simulate an error when jwtDecode is called with an invalid token
        spyOn(JwtDecodeWrapper, 'jwtDecode').and.throwError('Invalid token');

        // Test that an error is thrown
        expect(() => service.fetchSubject(invalidToken)).toThrowError('Invalid token');
    });
});
