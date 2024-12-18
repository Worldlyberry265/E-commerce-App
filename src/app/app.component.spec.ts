import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthStore } from './store/auth.store';
import { UserItemsStore } from './store/user-items.store';
import { FooterComponent } from './components/footer/footer.component';
import { MobileNavigationComponent } from './components/mobile-navigation/mobile-navigation.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { JwtDecodeService } from './services/jwt-decode.service';


describe('AppComponent', () => {
  let mockAuthStore: InstanceType<typeof AuthStore>;
  let mockUserItemsStore: InstanceType<typeof UserItemsStore>;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [AppComponent, FooterComponent, MobileNavigationComponent,],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();


    mockAuthStore = TestBed.inject(AuthStore);
    mockUserItemsStore = TestBed.inject(UserItemsStore);

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app component and fetch data', () => {

    spyOn(mockAuthStore, 'FetchJwtFromLocalStorage');
    spyOn(mockUserItemsStore, 'GetCart');

    fixture.detectChanges(); // to trigger ngOnInit

    expect(component).toBeTruthy();
    expect(mockAuthStore.FetchJwtFromLocalStorage).toHaveBeenCalled();
    expect(mockUserItemsStore.GetCart).toHaveBeenCalled();
  });
});