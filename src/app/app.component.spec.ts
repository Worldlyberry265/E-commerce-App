import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthStore } from './store/auth.store';
import { UserItemsStore } from './store/user-items.store';
import { HttpClientService } from './services/http/http.client.service';


describe('AppComponent', () => {
  let mockAuthStore: InstanceType<typeof AuthStore>;
  let mockUserItemsStore: InstanceType<typeof UserItemsStore>;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let httpClientServiceMock: jasmine.SpyObj<HttpClientService>;

  beforeEach(async () => {

    httpClientServiceMock = {} as jasmine.SpyObj<HttpClientService>;

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: HttpClientService, useValue: httpClientServiceMock },
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