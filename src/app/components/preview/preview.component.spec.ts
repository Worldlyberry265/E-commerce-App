import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PreviewComponent } from './preview.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { UserItemsStore } from '../../store/user-items.store';
import { createTestProduct, Product } from '../../models/Product';
import { HttpClientService } from '../../services/http/http.client.service';

describe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;
  let userItemsStore: InstanceType<typeof UserItemsStore>;
  let authStore: InstanceType<typeof AuthStore>;
  let mockRouter: jasmine.SpyObj<Router>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PreviewComponent>>;

  let httpClientServiceMock: jasmine.SpyObj<HttpClientService>;

  const mockCartItems: Product[] = [
    createTestProduct({ id: 1, title: 'Product 1', price: 10, image: '', category: '', quantity: undefined }),
    createTestProduct({ id: 2, title: 'Product 2', price: 20, image: '', category: '', quantity: 2 }),
  ];

  const mockSavedItems: Product[] = [
    createTestProduct({ id: 3, title: 'Product 3', price: 10, image: '', category: '', quantity: undefined }),
    createTestProduct({ id: 4, title: 'Product 4', price: 20, image: '', category: '', quantity: 20 }),
  ];


  // Utility function to setup MAT_DIALOG_DATA with dialog types
  function setupTest(dialogType: 'cart' | 'heart') {
    mockRouter = jasmine.createSpyObj('Router', ['navigate', 'serializeUrl', 'createUrlTree']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    httpClientServiceMock = {} as jasmine.SpyObj<HttpClientService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: Router, useValue: mockRouter },
        { provide: MAT_DIALOG_DATA, useValue: { DialogType: dialogType } },
        { provide: HttpClientService, useValue: httpClientServiceMock },
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

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  const testRemoveItem = (methodName: 'onRemoveItemFromCart' | 'onDecrementQuantity', itemIndex: number) => {
    setupTest('cart');
    spyOn(userItemsStore, 'RemoveItemFromCart');

    component[methodName](itemIndex);

    expect(component.products()).toEqual([mockCartItems[1]]); // First product should be removed
    const validmockCartItem = (mockCartItems[0]);
    validmockCartItem.quantity = 1;
    expect(userItemsStore.RemoveItemFromCart).toHaveBeenCalledWith(validmockCartItem);

    const cartIcon = document.getElementById('cart-svg-' + mockCartItems[0].id)
    expect(cartIcon?.classList).not.toContain('product-card__nav--item-active-cart');
  };

  describe('constructing the component', () => {
    it('should initialize products correctly when dialog type is "cart"', () => {
      setupTest('cart');
      expect(component.products()).toEqual(mockCartItems.map(product => ({ ...product, quantity: product.quantity ?? 1 })));
    });

    it('should initialize products correctly when dialog type is "heart"', () => {
      setupTest('heart');
      expect(component.products()).toEqual(mockSavedItems);
    });
  });

  it('should calculate remainingStar correctly', () => {
    setupTest('heart');
    expect(component.remainingStar(4.5)).toBeGreaterThanOrEqual(0.4);
  });

  it('should calculate total price correctly', () => {
    setupTest('cart');
    expect(component.TotalPrice).toBe('50.00'); // 10 * 1 + 20 * 2
  });

  it('should increment the quantity of a product', () => {
    setupTest('cart');
    component.onIncrementQuantity(0); // IncreonUpdateCartment first product
    expect(component.products()[0].quantity).toBe(2);
    component.onIncrementQuantity(1); // Increment 2nd product
    expect(component.products()[1].quantity).toBe(3);
  });

  describe('onDecremenet', () => {

    it('should decrement the quantity of a product', () => {
      setupTest('cart');
      component.onDecrementQuantity(1); // Decrement 2nd product
      expect(component.products()[1].quantity).toBe(1);
    });

    it('should remove the item instead of decrementing the quantity to 0', () => {
      testRemoveItem('onDecrementQuantity', 0)
    });
  });

  it('should remove item from cart', () => {
    testRemoveItem('onRemoveItemFromCart', 0)
  });

  describe('onNaviagte', () => {

    it('should close the dialog and navigate', fakeAsync(() => {
      setupTest('cart');

      component.onNavigate();
      expect(dialogRefSpy.close).toHaveBeenCalled();

      tick(100); // Simulate the timeout
      expect(mockRouter.navigate).toHaveBeenCalledWith(['login'], { fragment: 'logContainer' });
    }));

    it('should close the dialog and navigate to specified route', fakeAsync(() => {
      setupTest('cart');

      component.onNavigate('some-route');
      expect(dialogRefSpy.close).toHaveBeenCalled();

      tick(100); // Simulate the timeout
      expect(mockRouter.navigate).toHaveBeenCalledWith(['some-route']);
    }));

    it('should close the dialog and navigate to specified route in a new tab', fakeAsync(() => {
      setupTest('cart');

      const route = '/product/1'
      const url = 'http://some-url' + route;
      mockRouter.serializeUrl.and.returnValue(url);
      mockRouter.createUrlTree.and.returnValue({} as any);
      spyOn(window, 'open');

      component.onNavigate(route, true);
      expect(dialogRefSpy.close).toHaveBeenCalled();

      tick(100); // Simulate the timeout

      expect(mockRouter.createUrlTree).toHaveBeenCalledWith([route]);
      expect(mockRouter.serializeUrl).toHaveBeenCalled();
      expect(window.open).toHaveBeenCalledWith(url, '_blank');
    }));

  });

  it('should remove item from savedItems', () => {
    setupTest('heart');
    spyOn(userItemsStore, 'RemoveSavedItem');

    component.onRemoveSavedItem(0);

    expect(component.products()).toEqual([mockSavedItems[1]]); // First product should be removed
    expect(userItemsStore.RemoveSavedItem).toHaveBeenCalledWith(mockSavedItems[0]);

    const heartIcon = document.getElementById('heart-svg-' + mockCartItems[0].id)
    expect(heartIcon?.classList).not.toContain('product-card__nav--item-active-cart');
  });

  it('should clear the cart and remove the active class when onClearCart is called', () => {
    setupTest('cart');
    spyOn(userItemsStore, 'UpdateCart');

    component.onClearCart();

    const cartIcon1 = document.getElementById('cart-svg-' + mockCartItems[0].id)
    expect(cartIcon1?.classList).not.toContain('product-card__nav--item-active-cart');

    const cartIcon2 = document.getElementById('cart-svg-' + mockCartItems[1].id)
    expect(cartIcon2?.classList).not.toContain('product-card__nav--item-active-cart');

    expect(component.products()).toEqual([]);
    expect(userItemsStore.UpdateCart).toHaveBeenCalledWith([]);
  });

});
