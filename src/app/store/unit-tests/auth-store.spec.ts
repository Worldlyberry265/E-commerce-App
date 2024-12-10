import { TestBed } from '@angular/core/testing';
import { inject } from '@angular/core';
import { delay, of, switchMap, throwError, timer } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStore } from '../auth.store';
import { HttpClientService } from '../../services/http.client';
import { JwtDecodeService } from '../../services/jwt-decode.service';
import { UserItemsStore } from '../user-items.store';

describe('AuthStore', () => {
    let authStore: InstanceType<typeof AuthStore>;
    let userItemsStoreMock: InstanceType<typeof UserItemsStore>;

    let httpClientMock: jasmine.SpyObj<HttpClientService>;
    let jwtDecoderMock: jasmine.SpyObj<JwtDecodeService>;
    let routerMock: jasmine.SpyObj<Router>;

    const mockToken = 'mockJwtToken';
    const mockUserName = 'mockUser';

    // An exampe of an non-existent email to stimulate a server response
    const wrongEmail = "wrong-email@icloud.com";

    // Im using a user from fakestoreapi to get correct responses from fakestoreapi
    const correctUser = {
        email: "william@gmail.com",
        username: "hopkins",
        password: "William56$hj"
    };

    beforeEach(() => {
        httpClientMock = jasmine.createSpyObj('HttpClientService', ['postLogin', 'postAddUser']);
        jwtDecoderMock = jasmine.createSpyObj('JwtDecodeService', ['fetchSubject']);
        userItemsStoreMock = jasmine.createSpyObj('UserItemsStore', ['DeleteSavedItems']);
        routerMock = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClientService, useValue: httpClientMock },
                { provide: JwtDecodeService, useValue: jwtDecoderMock },
                { provide: UserItemsStore, useValue: userItemsStoreMock },
                { provide: Router, useValue: routerMock },
            ],
        });

        authStore = TestBed.inject(AuthStore);
    });


    // Testing Initial State
    it('should initialize with default state', () => {
        expect(authStore.authError()).toEqual(null);
        expect(authStore.loading()).toEqual(false);
        expect(authStore.emailNotFound()).toEqual(false);
        expect(authStore.jwt()).toEqual(null);
        expect(authStore.username()).toEqual(null);
        expect(authStore.lastRoute()).toEqual('/homepage');
    });

    describe('EmailLog', () => {
        it('should return an error upon entering the wrong email(non existent email)', () => {
            // Assert loading is initially false
            expect(authStore.loading()).toBe(false);

            authStore.EmailLog('wrong-email@icloud.com');
            // Assert loading is true immediately after calling the method
            expect(authStore.loading()).toBe(true);

            expect(authStore.authError()).toEqual("Please check if the email address you've entered is correct.");
            setTimeout(() => {
                expect(authStore.loading()).toBeFalse();
            }, 1000);
        });

        it('should take proceed to login without any errors', () => {
            // Assert loading is initially false
            expect(authStore.loading()).toBe(false);

            authStore.EmailLog(correctUser.email);

            expect(authStore.emailNotFound()).toEqual(false);
            expect(authStore.loading()).toBeFalse();
            expect(authStore.authError()).toBeNull();
        });

        it('should take proceed to sign up without any errors', () => {
            // Assert loading is initially false
            expect(authStore.loading()).toBe(false);

            authStore.EmailLog('any-email@gmail.com');

            expect(authStore.emailNotFound()).toEqual(true);
            expect(authStore.loading()).toBeFalse();
            expect(authStore.authError()).toBeNull();
        });

    });

    describe('PasswordLog', () => {
        it('should log in successfully and set the jwt - LOGIN', (done) => {

            // Added the delay and the timeout to test the changes of the loading state
            httpClientMock.postLogin.and.returnValue(of({ token: mockToken }).pipe(delay(10)));

            jwtDecoderMock.fetchSubject.and.returnValue(mockUserName);

            // Assert loading is initially false
            expect(authStore.loading()).toBe(false);
            authStore.PasswordLog({ email: correctUser.email, password: correctUser.password });
            // Assert loading is true immediately after calling the method
            expect(authStore.loading()).toBe(true);

            setTimeout(() => {
                expect(authStore.jwt()).toEqual(mockToken);
                expect(authStore.username()).toEqual(mockUserName);
                expect(authStore.loading()).toBeFalse();
                expect(authStore.authError()).toBeNull();
                expect(routerMock.navigate).toHaveBeenCalledWith([authStore.lastRoute()]);
                done();
            }, 20); // Slightly longer than the delay in the mocked observable
        });

        it('should set authError if user inputs the wrong password - LOGIN', (done) => {
            const errorResponse = { error: 'Invalid credentials' };
            // We use here a timer instead of a delay bcz delay doesn't work well with throwing an Error
            httpClientMock.postLogin.and.returnValue(
                timer(10).pipe(switchMap(() => throwError(() => errorResponse)))
            );

            // Assert loading is initially false
            expect(authStore.loading()).toBe(false);
            authStore.PasswordLog({ email: correctUser.email, password: 'anyvalidPassword123' });
            // Assert loading is true immediately after calling the method
            expect(authStore.loading()).toBe(true);
            console.log(authStore.loading());


            setTimeout(() => {
                console.log(authStore.loading());

                expect(authStore.authError()).toEqual(errorResponse.error);
                expect(authStore.loading()).toBeFalse();
                done();
            }, 20); // Slightly longer than the delay in the mocked observable

        });

        it('should sign up successfully and then login with the correct email to get a jwt - SIGN UP', (done) => {

            httpClientMock.postAddUser.and.returnValue(of({ id: 1 }));

            // Added the delay and the timeout to test the changes of the loading state
            httpClientMock.postLogin.and.returnValue(of({ token: mockToken }).pipe(delay(10)));

            jwtDecoderMock.fetchSubject.and.returnValue(mockUserName);

            // Assert loading is initially false
            expect(authStore.loading()).toBe(false);
            authStore.PasswordLog({ email: "anyValid-email@gmail.com", password: "anyValidPass123" });

            expect(httpClientMock.postAddUser).toHaveBeenCalledWith({ email: "anyValid-email@gmail.com", password: "anyValidPass123" });

            // Assert loading is true immediately after calling the method
            expect(authStore.loading()).toBe(true);


            setTimeout(() => {
                expect(authStore.jwt()).toEqual(mockToken);
                expect(authStore.username()).toEqual(mockUserName);
                expect(authStore.loading()).toBeFalse();
                expect(authStore.authError()).toBeNull();
                expect(routerMock.navigate).toHaveBeenCalledWith([authStore.lastRoute()]);
                done();
            }, 20); // Slightly longer than the delay in the mocked observable
        });
    });

    describe('FetchJwtFromLocalStorage', () => {
        it('should fetch JWT from local storage and set username', () => {
            spyOn(localStorage, 'getItem').and.returnValue(mockToken);
            jwtDecoderMock.fetchSubject.and.returnValue(mockUserName);

            authStore.FetchJwtFromLocalStorage();
            expect(authStore.jwt()).toEqual(mockToken);
            expect(authStore.username()).toEqual(mockUserName);
        });
    });

    describe('SignOut', () => {
        it('should sign out and clear jwt and username', () => {
            spyOn(localStorage, 'removeItem');

            authStore.SignOut();

            expect(localStorage.removeItem).toHaveBeenCalledWith('jwt');
            expect(authStore.jwt()).toBeNull();
            expect(authStore.username()).toBeNull();
            expect(authStore.lastRoute()).toEqual('/homepage');
            expect(userItemsStoreMock.DeleteSavedItems).toHaveBeenCalled();
            expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], { fragment: 'logContainer' });
        });
    });

    describe('SaveCurrentRoute', () => {
        it('should save the current route', () => {
            const route = '/dashboard';
            authStore.SaveCurrentRoute(route);
            expect(authStore.lastRoute()).toEqual(route);
        });
    });
});
