// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HeaderComponent } from './header.component';
// import { MatDialog } from '@angular/material/dialog';
// import { Router } from '@angular/router';
// import { AuthStore } from '../../store/auth.store';
// import { ProductStore } from '../../store/product.store';
// import { UserItemsStore } from '../../store/user-items.store';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogModule } from '@angular/material/dialog';
// import { RouterModule } from '@angular/router';
// import { of } from 'rxjs';

// describe('HeaderComponent', () => {
//   let component: HeaderComponent;
//   let fixture: ComponentFixture<HeaderComponent>;
//   let authStoreSpy: jasmine.SpyObj<AuthStore>;
//   let productStoreSpy: jasmine.SpyObj<ProductStore>;
//   let userItemsStoreSpy: jasmine.SpyObj<UserItemsStore>;
//   let matDialogSpy: jasmine.SpyObj<MatDialog>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(() => {
//     authStoreSpy = jasmine.createSpyObj('AuthStore', ['SignOut', 'SaveCurrentRoute', 'jwt', 'username']);
//     productStoreSpy = jasmine.createSpyObj('ProductStore', ['SearchForProducts']);
//     userItemsStoreSpy = jasmine.createSpyObj('UserItemsStore', ['savedItems', 'cartItems']);
//     matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
//     routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'url']);

//     TestBed.configureTestingModule({
//       declarations: [HeaderComponent],
//       imports: [MatButtonModule, MatDialogModule, RouterModule],
//       providers: [
//         { provide: AuthStore, useValue: authStoreSpy },
//         { provide: ProductStore, useValue: productStoreSpy },
//         { provide: UserItemsStore, useValue: userItemsStoreSpy },
//         { provide: MatDialog, useValue: matDialogSpy },
//         { provide: Router, useValue: routerSpy },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(HeaderComponent);
//     component = fixture.componentInstance;

//     authStoreSpy.jwt.and.returnValue('fake-jwt');
//     authStoreSpy.username.and.returnValue('Test User');
//     userItemsStoreSpy.savedItems.and.returnValue(of([]));
//     userItemsStoreSpy.cartItems.and.returnValue(of([]));
//     routerSpy.url = '/test-route';

//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should sign out the user when onSignOut is called', () => {
//     component.onSignOut();
//     expect(authStoreSpy.SignOut).toHaveBeenCalled();
//   });

//   it('should save the current route when onSaveRoute is called', () => {
//     component.onSaveRoute();
//     expect(authStoreSpy.SaveCurrentRoute).toHaveBeenCalledWith('/test-route');
//   });

//   it('should open the dialog when onOpenDialog is called', () => {
//     component.onOpenDialog('cart');
//     expect(matDialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), {
//       panelClass: 'preview',
//       data: { DialogType: 'cart' },
//     });
//   });

//   it('should search for products by id when input is a valid number', () => {
//     const event = { target: { value: '123' } } as unknown as Event;
//     component.onSearchForProduct(event);
//     expect(productStoreSpy.SearchForProducts).toHaveBeenCalledWith(123);
//   });

//   it('should search for products by name when input is a valid string', () => {
//     const event = { target: { value: 'Test Product' } } as unknown as Event;
//     component.onSearchForProduct(event);
//     expect(productStoreSpy.SearchForProducts).toHaveBeenCalledWith('Test Product');
//   });

//   it('should not search for products when input is invalid', () => {
//     const event = { target: { value: '--Invalid!' } } as unknown as Event;
//     component.onSearchForProduct(event);
//     expect(productStoreSpy.SearchForProducts).not.toHaveBeenCalled();
//   });

//   it('should emit navigateToProducts event with valid input', () => {
//     spyOn(component.navigateToProducts, 'emit');
//     const event = { target: { value: 'Test Product' } } as unknown as Event;
//     component.onSearchForProduct(event);
//     expect(component.navigateToProducts.emit).toHaveBeenCalledWith('Test Product');
//   });

//   it('should render search input when displaySearchInput is true', () => {
//     component.displaySearchInput = true;
//     fixture.detectChanges();
//     const searchInput = fixture.nativeElement.querySelector('.main-header__search');
//     expect(searchInput).toBeTruthy();
//   });

//   it('should not render search input when displaySearchInput is false', () => {
//     component.displaySearchInput = false;
//     fixture.detectChanges();
//     const searchInput = fixture.nativeElement.querySelector('.main-header__search');
//     expect(searchInput).toBeFalsy();
//   });
// });
