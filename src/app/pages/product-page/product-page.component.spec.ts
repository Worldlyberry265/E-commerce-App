import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProductPageComponent } from './product-page.component';
import { ProductStore } from '../../store/product.store';
import { AuthStore } from '../../store/auth.store';
import { UserItemsStore } from '../../store/user-items.store';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { createTestProduct, Product } from '../../models/Product';
import { PreviewComponent } from '../../components/preview/preview.component';
import { HttpClientService } from '../../services/http/http.client.service';

describe('ProductPageComponent', () => {
  let component: ProductPageComponent;
  let fixture: ComponentFixture<ProductPageComponent>;
  let mockProductStore: InstanceType<typeof ProductStore>;
  let mockAuthStore: InstanceType<typeof AuthStore>;
  let mockUserItemsStore: InstanceType<typeof UserItemsStore>;
  let mockDialog: any;

  const mockProduct: Product = ({ id: 3, title: 'Test Product', quantity: 2, price: 203, description: 'description', category: 'men', image: 'some-img-url', rating: { count: 40, rate: 2.5 } });

  let httpClientServiceMock: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    mockDialog = {
      open: jasmine.createSpy('open'),
    };

    httpClientServiceMock = {} as jasmine.SpyObj<HttpClientService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: HttpClientService, useValue: httpClientServiceMock },
        provideRouter([]),
      ],
    });

    mockAuthStore = TestBed.inject(AuthStore);
    mockProductStore = TestBed.inject(ProductStore);
    mockUserItemsStore = TestBed.inject(UserItemsStore);


    fixture = TestBed.createComponent(ProductPageComponent);
    component = fixture.componentInstance;


    spyOn(mockProductStore, 'selectedProduct').and.returnValue(mockProduct);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('constructing the component', () => {

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should set product from ProductStore on initialization', () => {
      fixture.detectChanges();
      expect(component.product()?.id).toBe(3);
    });

    it('should not toggle both item buttons if it\'s not in cart and savedItems', () => {
      spyOn(mockUserItemsStore, 'IsItemInCart').and.returnValue(false);
      spyOn(mockUserItemsStore, 'IsItemSaved').and.returnValue(false);

      fixture.detectChanges();

      expect(component.isItemAdded()).toBeFalse();
      expect(component.isItemSaved()).toBeFalse();
    });

    it('should toggle both item buttons if it\'s in cart and savedItems', () => {
      spyOn(mockUserItemsStore, 'IsItemInCart').and.returnValue(true);
      spyOn(mockUserItemsStore, 'IsItemSaved').and.returnValue(true);

      fixture.detectChanges();

      expect(component.isItemAdded()).toBeTrue();
      expect(component.isItemSaved()).toBeTrue();
    });

    it('should fetch relatedProducts', () => {
      spyOn(mockProductStore, 'relatedProducts').and.returnValue([mockProduct, mockProduct, mockProduct, mockProduct, mockProduct]);
      fixture.detectChanges();

      const allImgs = mockProductStore.relatedProducts()!.map((product) => {
        return { id: product.id, image: product.image, price: product.price }
      });
      expect(component.allImgs()).toEqual(allImgs);
      expect(component.displayedProducts()).toEqual(allImgs.slice(0, 5).reverse())
    });

    it('should fetch execute fetchAllProducts since relatedProducts are null at start', () => {
      spyOn(mockProductStore, 'FetchAllProducts');
      fixture.detectChanges();
      expect(mockProductStore.FetchAllProducts).toHaveBeenCalled();
    });

    it('should update the product quantity if it\'s different than the one in the cart', () => {
      const alteredProduct = createTestProduct({ ...mockProduct, quantity: 5 });
      spyOn(mockUserItemsStore, 'cartItems').and.returnValue([alteredProduct]);
      spyOn(mockUserItemsStore, 'IsItemInCart').and.returnValue(true);

      fixture.detectChanges();

      expect(component.product()?.quantity).toEqual(5);
    });
  });

  it('should call onNextClick every 2 seconds if isScrollEnabled returns true', fakeAsync(() => {

    spyOn(component, 'onNextClick');

    component.ngOnInit();
    tick(2000); // Simulate 2 seconds
    expect(component.onNextClick).toHaveBeenCalledTimes(1);

    tick(2000); // Simulate another 2 seconds
    expect(component.onNextClick).toHaveBeenCalledTimes(2);

    // Cleanup
    discardPeriodicTasks();
  }));

  it('should update ImageIndex to change the displayed relatedProducts', () => {
    spyOn(mockProductStore, 'relatedProducts').and.returnValue([mockProduct, mockProduct, mockProduct, mockProduct, mockProduct]);

    fixture.detectChanges();

    component.onNextClick();

    expect(component.ImageIndex()).toEqual(0); // Should reset the index to 0

    component.onNextClick();

    expect(component.ImageIndex()).toEqual(1); // Should increment the index to 1
  });

  describe('onCancelScrolling', () => {

    it('should disable scrolling if the window width is greater than or equal to 450', () => {
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(500);
      const spy = spyOn(component.isScrollEnabled, 'set');

      component.onCancelScrolling();

      expect(spy).toHaveBeenCalledWith(false); // Verify scrolling was disabled
    });

    it('should not disable scrolling if the window width is less than 450', () => {
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(400);
      const spy = spyOn(component.isScrollEnabled, 'set');

      component.onCancelScrolling();

      expect(spy).not.toHaveBeenCalled(); // Verify scrolling was not disabled
    });
  });

  describe('onAlterCart', () => {

    it('should remove the item from the cart and update the isItemAdded state', () => {
      spyOn(mockUserItemsStore, 'IsItemInCart').and.returnValue(true);
      fixture.detectChanges();
      expect(component.isItemAdded()).toBeTrue();

      spyOn(mockUserItemsStore, 'RemoveItemFromCart');

      component.onAlterCart();

      expect(mockUserItemsStore.RemoveItemFromCart).toHaveBeenCalled();
      expect(component.isItemAdded()).toBeFalse();
    });
    it('should add the item to the cart and update the isItemAdded state', () => {
      spyOn(mockUserItemsStore, 'IsItemInCart').and.returnValue(false);
      expect(component.isItemAdded()).toBeFalse();

      spyOn(mockUserItemsStore, 'AddItemToCart');

      component.onAlterCart();
      expect(mockUserItemsStore.AddItemToCart).toHaveBeenCalled();
      expect(component.isItemAdded()).toBeTrue();
    });
  });

  describe('onAlterSavedItems', () => {

    it('should open the preview to ask the user to sign in instead of adding the item to the saved items', () => {

      spyOn(mockAuthStore, 'jwt').and.returnValue(null);
      spyOn(component.dialog, 'open');

      component.onAlterSavedItems();

      setTimeout(() => {
        // to give time for the preview component to inialize
        expect(mockDialog.open).toHaveBeenCalledWith(PreviewComponent, {
          panelClass: 'preview',
          data: { DialogType: 'heart' },
        });
      }, 1000);

    });

    it('should unsave the item since it is already in the saved items and the user is signed in', () => {

      spyOn(mockAuthStore, 'jwt').and.returnValue('token');
      spyOn(mockUserItemsStore, 'IsItemSaved').and.returnValue(true);
      spyOn(mockUserItemsStore, 'RemoveSavedItem');

      fixture.detectChanges();

      expect(component.isItemSaved()).toBeTrue();

      component.onAlterSavedItems();

      expect(component.isItemSaved()).toBeFalse();
      expect(mockUserItemsStore.RemoveSavedItem).toHaveBeenCalledWith(mockProduct);
    });

    it('should save the item since it is not in the saved items and the user is signed in', () => {

      spyOn(mockAuthStore, 'jwt').and.returnValue('token');
      spyOn(mockUserItemsStore, 'IsItemSaved').and.returnValue(false);
      spyOn(mockUserItemsStore, 'SaveItem');

      fixture.detectChanges();

      expect(component.isItemSaved()).toBeFalse();

      component.onAlterSavedItems();

      expect(component.isItemSaved()).toBeTrue();
      expect(mockUserItemsStore.SaveItem).toHaveBeenCalledWith(mockProduct);
    });

  });

  it('should decrement product quantity if quantity is only more than 1 and update the cart if the item is in cart', () => {

    spyOn(mockUserItemsStore, 'IsItemInCart').and.returnValue(true);
    spyOn(mockUserItemsStore, 'cartItems').and.returnValue([mockProduct]);
    spyOn(mockUserItemsStore, 'UpdateItemInCart');
    fixture.detectChanges();

    component.onDecrementQuantity();
    // timeout to wait for the quantity update to be done
    setTimeout(() => {
      expect(component.product()?.quantity).toEqual(1);
      expect(mockUserItemsStore.UpdateItemInCart).toHaveBeenCalled();
    }, 1000);

    component.onDecrementQuantity();
    setTimeout(() => {
      expect(component.product()?.quantity).toEqual(1); // shouldn't decremenet if less than or equal to 1
    }, 2000);

  });

  it('should increment product quantity and update the cart if the item is in cart', () => {

    spyOn(mockUserItemsStore, 'IsItemInCart').and.returnValue(true);
    spyOn(mockUserItemsStore, 'cartItems').and.returnValue([mockProduct]);
    spyOn(mockUserItemsStore, 'UpdateItemInCart');
    fixture.detectChanges();

    component.onIncrementQuantity();
    // timeout to wait for the quantity update to be done
    setTimeout(() => {
      expect(component.product()?.quantity).toEqual(3);
      expect(mockUserItemsStore.UpdateItemInCart).toHaveBeenCalled();
    }, 1000);
  });

});
