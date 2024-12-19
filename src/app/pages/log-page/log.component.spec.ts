import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogComponent } from './log.component';
import { AuthStore } from '../../store/auth.store';
import { HttpClientService } from '../../services/http.client';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // <-- Add this import
import { User } from '../../models/User';

describe('LogComponent', () => {
  let component: LogComponent;
  let fixture: ComponentFixture<LogComponent>;
  let mockAuthStore: InstanceType<typeof AuthStore>;

  let httpClientServiceMock: jasmine.SpyObj<HttpClientService>;


  const mockUser: User = {
    email: 'baraa.ghalayini@lau.edu',
    password: 'Password123!'
  }

  beforeEach(async () => {

    httpClientServiceMock = {} as jasmine.SpyObj<HttpClientService>;

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
      ],
      providers: [
        provideRouter([]),
        { provide: HttpClientService, useValue: httpClientServiceMock },
      ],
    }).compileComponents();

    mockAuthStore = TestBed.inject(AuthStore);

    fixture = TestBed.createComponent(LogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set authError in the passwordFormControl if the auth store isn\'t loading and the store has an authError', () => {
    spyOn(mockAuthStore, 'authError').and.returnValue('authErrorMsg');
    spyOn(mockAuthStore, 'loading').and.returnValue(false);

    setTimeout(() => {
      expect(component.passwordFormControl.hasError('authError'));
    }, 1);
  });

  describe('ngAfterViewInit', () => {

    it('should focus the input element after view initialization on desktop', () => {
      spyOn(component, 'getWindowInnerWidth').and.returnValue(1024);
      const focusSpy = spyOn(component.input.nativeElement, 'focus');
      component.ngAfterViewInit();
      expect(focusSpy).toHaveBeenCalled();
    });

    it('shouldn\'t focus the input element after view initialization on mobile', () => {
      spyOn(component, 'getWindowInnerWidth').and.returnValue(350);
      const focusSpy = spyOn(component.input.nativeElement, 'focus');
      component.ngAfterViewInit();
      expect(focusSpy).not.toHaveBeenCalled();
    });
  });

  describe('onSubmitForm', () => {

    it('should submit form if it\'s valid', () => {
      spyOn(mockAuthStore, 'PasswordLog');
      component.emailFormControl.setValue(mockUser.email);
      component.passwordFormControl.setValue(mockUser.password);
      component.onSubmitForm();
      expect(component.passwordConfirmationFormControl.valid || component.passwordConfirmationFormControl.value === '').toBeTrue();
      expect(mockAuthStore.PasswordLog).toHaveBeenCalledWith(mockUser);
    });

    it('shouldn\'t submit form if it\'s not valid', () => {
      spyOn(mockAuthStore, 'PasswordLog');
      component.passwordFormControl.setValue(mockUser.password);
      component.passwordConfirmationFormControl.setValue('not a matched-password');

      component.onSubmitForm();
      expect(component.passwordConfirmationFormControl.valid).toBeFalse();
      expect(mockAuthStore.PasswordLog).not.toHaveBeenCalled();
    });
  });

  describe('onSigningWithEmail', () => {

    it('should set an error to the emailFormControl if authError occurs in authStore', () => {
      spyOn(mockAuthStore, 'authError').and.returnValue('error-msg');
      spyOn(mockAuthStore, 'EmailLog');
      component.onSigningWithEmail();
      setTimeout(() => {
        expect(component.emailFormControl.hasError('authError')).toBeTrue();
      }, 1001);
    });

    it('should set the error off in the emailFormControl if authError doesn\'t occur in authStore', () => {
      spyOn(mockAuthStore, 'EmailLog');
      spyOn(mockAuthStore, 'authError').and.returnValue(null);
      component.onSigningWithEmail();
      expect(component.emailFormControl.hasError('authError')).toBeFalse();
    });
  });

  it('should trigger animation then reset the confirmed password in onChangeEmail', () => {
    const initialFormType = component.formType;
    component.onChangeEmail();
    expect(component.formType).not.toEqual(initialFormType);
    expect(component.passwordConfirmationFormControl.value).toBe('');
  });

  it('should toggle password visibility when onTogglePasswordVisibility is called', () => {
    const initialState = component.showPass();
    component.onTogglePasswordVisibility();
    expect(component.showPass()).toBe(!initialState);
  });

});
