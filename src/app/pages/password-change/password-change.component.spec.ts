import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthStore } from '../../store/auth.store';
import { provideRouter } from '@angular/router';
import { User } from '../../models/User';
import { PasswordChangeComponent } from './password-change.component';
import { JwtDecodeService } from '../../services/auth/jwt-decode.service';
import { MatDialog } from '@angular/material/dialog';
import { PreviewComponent } from '../../components/preview/preview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientService } from '../../services/http/http.client.service';

describe('Password-ChangeComponent', () => {
  let component: PasswordChangeComponent;
  let fixture: ComponentFixture<PasswordChangeComponent>;
  let mockAuthStore: InstanceType<typeof AuthStore>;

  let httpClientServiceMock: jasmine.SpyObj<HttpClientService>;

  let mockJwtService: JwtDecodeService;
  let mockDialog: any;


  const mockUser: User = {
    email: 'baraa.ghalayini@lau.edu',
    password: 'Password123!'
  }

  beforeEach(async () => {

    httpClientServiceMock = {} as jasmine.SpyObj<HttpClientService>;

    mockDialog = {
      open: jasmine.createSpy('open'),
    };

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
      ],
      providers: [
        provideRouter([]),
        JwtDecodeService,
        { provide: MatDialog, useValue: mockDialog },
        { provide: HttpClientService, useValue: httpClientServiceMock },
      ],
    }).compileComponents();

    mockAuthStore = TestBed.inject(AuthStore);
    mockJwtService = TestBed.inject(JwtDecodeService);

    fixture = TestBed.createComponent(PasswordChangeComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor effect', () => {

    it('should set authError in the passwordFormControl if the auth store isn\'t loading and the request timed out', () => {
      spyOn(mockAuthStore, 'authError').and.returnValue('Request Timed Out');
      spyOn(mockAuthStore, 'loading').and.returnValue(false);

      setTimeout(() => {
        expect(component.passwordFormControl.hasError('authError'));
      }, 1);
    });

    it('should remove the authError in the passwordFormControl if the auth store isn\'t loading and the authError isn\'t request timed out', () => {
      spyOn(mockAuthStore, 'authError').and.returnValue('Jwt Expired or Invalid');
      spyOn(mockAuthStore, 'loading').and.returnValue(false);

      expect(!component.passwordFormControl.hasError('authError'));
    });
  });

  describe('onSubmitForm', () => {

    it('should submit form if it\'s valid', () => {
      spyOn(mockAuthStore, 'ChangePassword');
      spyOn(mockJwtService, 'fetchId').and.returnValue(3);
      spyOn(mockAuthStore, 'authError').and.returnValue("Jwt Expired or Invalid");
      spyOn(component.dialog, 'open');

      component.passwordFormControl.setValue(mockUser.password);
      component.passwordConfirmationFormControl.setValue(mockUser.password);

      component.onSubmitForm();

      expect(component.passwordConfirmationFormControl.valid).toBeTrue();
      expect(mockAuthStore.ChangePassword).toHaveBeenCalledWith({ password: mockUser.password, userId: 3 });

      setTimeout(() => {
        // to give time for the preview component to inialize
        expect(mockDialog.open).toHaveBeenCalledWith(PreviewComponent, {
          panelClass: 'preview',
          data: { DialogType: 'Expired Jwt' },
        });
      }, 1000);

    });

    it('shouldn\'t submit form if the passwords doesn\'t match', () => {
      spyOn(mockAuthStore, 'ChangePassword');
      component.passwordFormControl.setValue(mockUser.password);
      component.passwordConfirmationFormControl.setValue('not a matched-password');

      component.onSubmitForm();
      expect(mockAuthStore.ChangePassword).not.toHaveBeenCalled();
    });
  });

  it('should toggle password visibility when onTogglePasswordVisibility is called', () => {
    const initialState = component.showPass();
    component.onTogglePasswordVisibility();
    expect(component.showPass()).toBe(!initialState);
  });

});
