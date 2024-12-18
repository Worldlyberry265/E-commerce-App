import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileNavigationComponent } from './mobile-navigation.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { UserItemsStore } from '../../store/user-items.store';
import { PreviewComponent } from '../preview/preview.component';
import { ElementRef } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MobileNavigationComponent', () => {
  let component: MobileNavigationComponent;
  let fixture: ComponentFixture<MobileNavigationComponent>;

  let mockUserItemsStore: InstanceType<typeof UserItemsStore>;
  let mockAuthStore: InstanceType<typeof AuthStore>;

  let router: Router;
  const mockRoute = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PreviewComponent>>;

  beforeEach(() => {

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['open']);


    TestBed.configureTestingModule({
      imports: [MobileNavigationComponent, PreviewComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: ActivatedRoute, useValue: mockRoute },
        provideHttpClient(withInterceptorsFromDi()),
        Router
      ],
    });

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(MobileNavigationComponent);
    component = fixture.componentInstance;

    mockUserItemsStore = TestBed.inject(UserItemsStore);
    mockAuthStore = TestBed.inject(AuthStore);

    // Mock ViewChild
    component.mobileCheckbox = {
      nativeElement: { checked: false },
    } as ElementRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close mobile navigation and open the dialog', () => {
    component.onOpenDialog('cart');


    expect(mockUserItemsStore.isPreviewDisplayed()).toBe(true);
    expect(component.mobileCheckbox.nativeElement.checked).toBeFalse();
  });

  it('should save the current route and close navigation', () => {
    component.onCloseNavAndSaveRoute();

    expect(mockAuthStore.lastRoute()).toEqual(router.url);
    expect(component.mobileCheckbox.nativeElement.checked).toBeFalse();
  });

  it('should close the mobile navigation', () => {
    component.onCloseNav();
    expect(component.mobileCheckbox.nativeElement.checked).toBeFalse();
  });

  it('should sign out and close mobile navigation', () => {
    spyOn(mockAuthStore, 'SignOut');
    component.onSignOut();

    expect(mockAuthStore.SignOut).toHaveBeenCalled();
    expect(component.mobileCheckbox.nativeElement.checked).toBeFalse();
  });
});
