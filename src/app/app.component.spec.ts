import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthStore } from './store/auth.store';
import { UserItemsStore } from './store/user-items.store';
import { FooterComponent } from './components/footer/footer.component';
import { MobileNavigationComponent } from './components/mobile-navigation/mobile-navigation.component';
import { of } from 'rxjs';

// Mock AuthStore
const mockAuthStore = {
  FetchJwtFromLocalStorage: jasmine.createSpy('FetchJwtFromLocalStorage'),
  jwt: jasmine.createSpy('jwt').and.returnValue('mocked-jwt-token')  // Mock jwt method

};

// Mock UserItemsStore
const mockUserItemsStore = {
  GetCart: jasmine.createSpy('GetCart').and.returnValue(of([])),
  isPreviewDisplayed: jasmine.createSpy('isPreviewDisplayed').and.returnValue(false)
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        FooterComponent,
        MobileNavigationComponent
      ],
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: UserItemsStore, useValue: mockUserItemsStore },
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the app component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call FetchJwtFromLocalStorage on init', () => {
    TestBed.createComponent(AppComponent).detectChanges();
    expect(mockAuthStore.FetchJwtFromLocalStorage).toHaveBeenCalled();
  });

  it('should call GetCart on init', () => {
    TestBed.createComponent(AppComponent).detectChanges();
    expect(mockUserItemsStore.GetCart).toHaveBeenCalled();
  });
});