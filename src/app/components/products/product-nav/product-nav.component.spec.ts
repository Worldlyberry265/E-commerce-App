import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductNavComponent } from './product-nav.component';
import { MatDialog } from '@angular/material/dialog';
import { createTestProduct, Product } from '../../../models/Product';
import { ComponentRef } from '@angular/core';
import { UserItemsStore } from '../../../store/user-items.store';
import { AuthStore } from '../../../store/auth.store';
import { PreviewComponent } from '../../preview/preview.component';
import { HttpClientService } from '../../../services/http.client';

describe('ProductNavComponent', () => {
  let userItemsStore: InstanceType<typeof UserItemsStore>;
  let authStore: InstanceType<typeof AuthStore>;

  let component: ProductNavComponent;
  let fixture: ComponentFixture<ProductNavComponent>;
  let componentRef: ComponentRef<ProductNavComponent>;

  let mockDialog: any;

  const productMock: Product = createTestProduct({ id: 123, title: 'Test Product', price: 100 });

  let httpClientServiceMock: jasmine.SpyObj<HttpClientService>;

  beforeEach(async () => {

    httpClientServiceMock = {} as jasmine.SpyObj<HttpClientService>;

    mockDialog = {
      open: jasmine.createSpy('open'),
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: mockDialog, },
        { provide: HttpClientService, useValue: httpClientServiceMock },
      ],
    }).compileComponents();

    userItemsStore = TestBed.inject(UserItemsStore);
    authStore = TestBed.inject(AuthStore);


    fixture = TestBed.createComponent(ProductNavComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('appProductNav', productMock);
  });

  it('should create the component and have an input', () => {
    expect(component).toBeTruthy();
    expect(component.product()).toEqual(productMock);
  });

  it('should initialize cart and heart elements after view init', () => {
    userItemsStore.TESTER_METHOD_Populate_CartItems([productMock]);
    userItemsStore.TESTER_METHOD_Populate_SavedItems([productMock]);

    fixture.detectChanges();

    const cartElement = document.getElementById(`cart-svg-${productMock.id}`);
    const heartElement = document.getElementById(`heart-svg-${productMock.id}`);

    expect(cartElement?.classList).toContain('product-card__nav--item-active-cart');
    expect(heartElement?.classList).toContain('product-card__nav--item-active-heart');
  });

  describe('onToggleItem', () => {
    it('should add or remove the item into or from cart and update UI - CART', () => {
      spyOn(userItemsStore, 'AddItemToCart');
      spyOn(userItemsStore, 'RemoveItemFromCart');
      // im not spying on the cart because we need to add to it and then remove from it

      fixture.detectChanges();

      component.onToggleItem('cart');

      const cartElement = document.getElementById(`cart-svg-${productMock.id}`);

      expect(userItemsStore.AddItemToCart).toHaveBeenCalledWith(productMock);
      // since im spying on addtocart, i need to manually add the item
      userItemsStore.TESTER_METHOD_Populate_CartItems([productMock]);
      expect(cartElement?.classList).toContain('product-card__nav--item-active-cart');

      component.onToggleItem('cart');
      expect(userItemsStore.RemoveItemFromCart).toHaveBeenCalledWith(productMock);
      expect(cartElement?.classList).not.toContain('product-card__nav--item-active-cart');
    });

    it('should add or remove the item into or from saved items and update UI - HEART', () => {
      spyOn(userItemsStore, 'SaveItem');
      spyOn(userItemsStore, 'RemoveSavedItem');
      spyOn(authStore, 'jwt').and.returnValue('mockToken');

      fixture.detectChanges();

      component.onToggleItem('heart');

      const heartElement = document.getElementById(`heart-svg-${productMock.id}`);

      expect(userItemsStore.SaveItem).toHaveBeenCalledWith(productMock);
      // since im spying on addtocart, i need to manually add the item
      userItemsStore.TESTER_METHOD_Populate_SavedItems([productMock]);
      expect(heartElement?.classList).toContain('product-card__nav--item-active-heart');

      component.onToggleItem('heart');
      expect(userItemsStore.RemoveSavedItem).toHaveBeenCalledWith(productMock);
      expect(heartElement?.classList).not.toContain('product-card__nav--item-active-heart');
    });

    it('should open dialog if user is not logged in and attempts to save an item', () => {
      spyOn(authStore, 'jwt').and.returnValue(null);
      component.onToggleItem('heart');

      expect(mockDialog.open).toHaveBeenCalledWith(PreviewComponent, {
        panelClass: 'preview',
        data: { DialogType: 'heart' },
      });
    });
  });

});
