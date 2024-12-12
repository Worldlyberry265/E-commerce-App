import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewComponent } from './preview.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { UserItemsStore } from '../../store/user-items.store';
import { of } from 'rxjs';
import { createTestProduct, Product } from '../../models/Product';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { signal } from '@angular/core';

describe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;
  let userItemsStore: InstanceType<typeof UserItemsStore>;
  let authStore: InstanceType<typeof AuthStore>;
  let mockRouter: jasmine.SpyObj<Router>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PreviewComponent>>;

  const mockCartItems: Product[] = [
    createTestProduct({ id: 1, title: 'Product 1', price: 10, image: '', category: '', quantity: 0 }),
    createTestProduct({ id: 2, title: 'Product 2', price: 20, image: '', category: '', quantity: 2 }),
  ];

  const mockSavedItems: Product[] = [
    createTestProduct({ id: 3, title: 'Product 3', price: 10, image: '', category: '', quantity: 0 }),
    createTestProduct({ id: 4, title: 'Product 4', price: 20, image: '', category: '', quantity: 20 }),
  ];


  // Utility function to setup MAT_DIALOG_DATA with dialog types
  function setupTest(dialogType: 'cart' | 'heart') {
    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'serializeUrl', 'createUrlTree']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [MatDialogModule, PreviewComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: Router, useValue: mockRouter },
        { provide: MAT_DIALOG_DATA, useValue: { DialogType: dialogType } },
        provideHttpClient(withInterceptorsFromDi()),
      ]
    }).compileComponents();

    userItemsStore = TestBed.inject(UserItemsStore);
    authStore = TestBed.inject(AuthStore);


    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;

    spyOn(authStore, 'jwt').and.returnValue('mockToken');
    spyOn(userItemsStore, 'cartItems').and.returnValue(mockCartItems);
    spyOn(userItemsStore, 'savedItems').and.returnValue(mockSavedItems);

    fixture.detectChanges();
  }

  it('should create the component', () => {
    setupTest('cart'); // any value
    expect(component).toBeTruthy();
    expect(component.products()).toEqual(mockCartItems.map(product => ({ ...product, quantity: product.quantity ?? 1 })));
  });

  // describe('constructing the component', () => {
  //   // it('should initialize products correctly when dialog type is "cart"', () => {
  //   //   setupTest('cart');
  //   //   // spyOn(userItemsStore, 'cartItems').and.returnValue(mockCartItems);
  //   //   // spyOn(userItemsStore, 'savedItems').and.returnValue(mockCartItems);

  //   //   console.log(component.dialogType());

  //   //   console.log(userItemsStore.cartItems());
  //   //   console.log(userItemsStore.cartItems());

  //   //   console.log(component.products());
  //   //   fixture.detectChanges();
  //   //   console.log(component.products());

  //   //   // expect()
  //   //   expect(component.products()).toEqual(mockCartItems.map(product => ({ ...product, quantity: product.quantity ?? 1 })));
  //   // });

  //   // it('should initialize products correctly when dialog type is "heart"', () => {
  //   //   component.dialogType.set('heart');
  //   //   // component.ngOnInit();
  //   //   expect(component.products()).toEqual(mockSavedItems);
  //   // });
  // });

  // it('should calculate total price correctly', () => {
  //   component.dialogType.set('cart');
  //   component.products.set(mockCartItems);
  //   fixture.detectChanges();
  //   expect(component.TotalPrice).toBe('50.00'); // 10 * 1 + 20 * 2
  // });

  // it('should increment the quantity of a product', () => {
  //   component.dialogType.set('cart');
  //   component.products.set(mockCartItems);
  //   component.onIncrementQuantity(0); // Increment first product
  //   expect(component.products()[0].quantity).toBe(2); // First product quantity should be 2
  // });

  // it('should decrement the quantity of a product', () => {
  //   component.dialogType.set('cart');
  //   component.products.set(mockCartItems);
  //   component.onDecrementQuantity(0); // Decrement first product
  //   expect(component.products()[0].quantity).toBe(0); // First product quantity should be 0
  // });

  // it('should remove item from cart', () => {
  //   component.dialogType.set('cart');
  //   component.products.set(mockCartItems);
  //   component.onRemoveItemFromCart(0);
  //   expect(component.products()).toEqual([mockCartItems[1]]); // First product should be removed
  //   expect(mockUserItemsStore.RemoveItemFromCart).toHaveBeenCalledWith(mockCartItems[0]);
  // });

  // it('should navigate on Pay', () => {
  //   component.dialogType.set('cart');
  //   component.products.set(mockCartItems);
  //   component.onPay();
  //   expect(mockRouter.navigate).toHaveBeenCalledWith(['homepage']);
  //   expect(mockUserItemsStore.UpdateCart).toHaveBeenCalledWith([]);
  // });

  // it('should close the dialog when navigating', () => {
  //   component.onNavigate('login');
  //   expect(dialogRefSpy.close).toHaveBeenCalled();
  // });

  // it('should update cart when onUpdateCart is called', () => {
  //   component.dialogType.set('cart');
  //   component.products.set(mockCartItems);
  //   component.onUpdateCart();
  //   expect(mockUserItemsStore.UpdateCart).toHaveBeenCalledWith(mockCartItems);
  // });

  // it('should clear the cart when onClearCart is called', () => {
  //   component.dialogType.set('cart');
  //   component.products.set(mockCartItems);
  //   component.onClearCart();
  //   expect(mockUserItemsStore.UpdateCart).toHaveBeenCalledWith([]);
  // });

  // to rest the state after each test
  // afterEach(() => {
  //   fixture.destroy();
  // });
});
