import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthStore } from '../../../store/auth.store';
import { JwtDecodeService } from '../../auth/jwt-decode.service';
import { authInterceptorFn } from '../auth-interceptor.service';

describe('authInterceptorFn', () => {
    let mockAuthStore: InstanceType<typeof AuthStore>;

    let mockJwtService: JwtDecodeService;

    let mockNext: jasmine.Spy<HttpHandlerFn>;

    beforeEach(() => {
        mockNext = jasmine.createSpy('next').and.callFake((req) => of({} as HttpEvent<any>));

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
            ],
        });

        mockAuthStore = TestBed.inject(AuthStore);
        mockJwtService = TestBed.inject(JwtDecodeService);

    });

    it('should pass through the request if no JWT is present', () => {
        spyOn(mockAuthStore, 'jwt').and.returnValue(null);

        const req = new HttpRequest('GET', '/test');

        TestBed.runInInjectionContext(() => {
            authInterceptorFn(req, mockNext).subscribe({
                next: () => {
                    expect(mockNext).toHaveBeenCalledWith(req);
                    expect(mockNext).toHaveBeenCalledTimes(1);
                },
                error: () => fail('Expected request to be passed successfully.'),
            });
        });

    });

    it('should throw an error if JWT is expired', () => {
        spyOn(mockAuthStore, 'jwt').and.returnValue('fake jwt');
        spyOn(mockJwtService, 'isJwtExpired').and.returnValue(true);

        // Create HttpRequest with the Authorization header
        const req: HttpRequest<any> = new HttpRequest('GET', '/test', {
            headers: new HttpHeaders().set('Authorization', `Bearer `)
        });

        TestBed.runInInjectionContext(() => {
            authInterceptorFn(req, mockNext).subscribe({
                next: () => fail('Expected an error, but the interceptor completed successfully.'),
                error: (error) => {
                    expect(error).toEqual(new Error('JWT is expired.'));
                },
            });
        });

        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw an error if JWT is invalid', () => {
        spyOn(mockAuthStore, 'jwt').and.returnValue('fake jwt');
        spyOn(mockJwtService, 'isJwtExpired').and.throwError('JWT is invalid.');

        // Create HttpRequest with the Authorization header
        const req: HttpRequest<any> = new HttpRequest('GET', '/test', {
            headers: new HttpHeaders().set('Authorization', `Bearer `)
        });

        TestBed.runInInjectionContext(() => {
            authInterceptorFn(req, mockNext).subscribe({
                next: () => fail('Expected an error, but the interceptor completed successfully.'),
                error: (error) => {
                    expect(error).toEqual(new Error('JWT is invalid.'));
                },
            });
        });

        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should add the jwt token to the Authorization header and pass the request if JWT is valid', () => {
        spyOn(mockAuthStore, 'jwt').and.returnValue('fake jwt');
        spyOn(mockJwtService, 'isJwtExpired').and.returnValue(false);


        // Create HttpRequest with the Authorization header
        const req: HttpRequest<any> = new HttpRequest('GET', '/test', {
            headers: new HttpHeaders().set('Authorization', `Bearer `)
        });

        TestBed.runInInjectionContext(() => {
            authInterceptorFn(req, mockNext).subscribe({
                next: () => {
                    // Assert: Verify that the cloned request contains the valid Authorization header
                    const clonedReq = mockNext.calls.mostRecent().args[0] as HttpRequest<any>;
                    expect(clonedReq.headers.get('Authorization')).toBe('Bearer fake jwt');
                },
                error: () => fail('Expected request to be passed successfully.'),
            });
        });

    });
});
