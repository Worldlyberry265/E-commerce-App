import { TestBed } from '@angular/core/testing';
import { createTestProduct, Product } from '../../models/Product';
import { UserItemsStore } from '../user-items.store';

describe('UserItemsStore', () => {
  let store: InstanceType<typeof UserItemsStore>;

  // Mocking LocalStorage in Tests
  beforeEach(() => {
    TestBed.configureTestingModule({});

    // Use TestBed.runInInjectionContext to properly initialize the store with inject()
    TestBed.runInInjectionContext(() => {
      store = TestBed.inject(UserItemsStore);
    });

  });

  afterEach(() => {
    localStorage.clear();  // Ensures no state persists between tests
  });

  // Testing Initial State
  it('should initialize with default state', () => {
    expect(store.cartItems()).toEqual([]);
    expect(store.savedItems()).toEqual([]);
    expect(store.isPreviewDisplayed()).toBeFalse();
  });


  describe('GetCart', () => {
    it('should populate cartItems from localStorage if data exists', () => {
      const mockCart: Product[] = [
        createTestProduct({ id: 1, title: 'Product A', price: 20 }),
        createTestProduct({ id: 2, title: 'Product B', price: 30 }),
      ];

      // Mock localStorage
      // If it's requesting products-cart we return our mockCart else we return nothing(null)
      spyOn(localStorage, 'getItem').and.callFake((searchedItem: string) => {
        if (searchedItem === 'products-cart') {
          return JSON.stringify(mockCart);
        }
        return null;
      });

      store.GetCart();

      // Assert cartItems are populated from localStorage
      expect(store.cartItems()).toEqual(mockCart);
    });
  });

  describe('SaveItem', () => {
    it('should save an item to the saved items list', () => {
      const product: Product = createTestProduct({ id: 1, title: 'Product', price: 50 });
      store.SaveItem(product);
      expect(store.savedItems()).toContain(product);
    });
  });

  describe('AddItemToCart', () => {
    it('should store cart items in localStorage when adding to cart', () => {
      const product: Product = createTestProduct({ id: 4, title: 'Local Product', price: 50 });
      spyOn(localStorage, 'setItem'); // To not alter the real localStorage on the browser
      store.AddItemToCart(product);
      expect(store.cartItems()).toContain(product);
      expect(localStorage.setItem).toHaveBeenCalledWith('products-cart', JSON.stringify(store.cartItems()));
    });
  });

  describe('RemoveSavedItem', () => {
    it('should remove a saved item from the list', () => {
      const product = createTestProduct({ id: 1, title: 'Product', price: 50 });
      store.SaveItem(product);
      store.RemoveSavedItem(product);
      expect(store.savedItems()).not.toContain(product);
    });
  });

  describe('RemoveItemFromCart', () => {
    it('should remove an item from the cart and update the cart in the localStorage', () => {
      // Add initial items to the cart
      const product1 = createTestProduct({ id: 1, title: 'Product 1', price: 100 });
      const product2 = createTestProduct({ id: 2, title: 'Product 2', price: 200 });
      spyOn(localStorage, 'setItem'); // To not alter the real localStorage on the browser
      store.AddItemToCart(product1);
      store.AddItemToCart(product2);

      // Remove one product
      store.RemoveItemFromCart(product1);

      // Assert the product was removed from cartItems
      expect(store.cartItems()).not.toContain(product1);
      expect(store.cartItems()).toContain(product2);

      // Assert localStorage was updated with the remaining cartItems
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'products-cart',
        JSON.stringify(store.cartItems())
      );
    });
  });

  describe('UpdateCart', () => {
    it('should update localStorage on cart update', () => {
      const products: Product[] = [
        createTestProduct({ id: 1, title: 'Product A', price: 20 }),
        createTestProduct({ id: 2, title: 'Product B', price: 40 }),
      ];
      spyOn(localStorage, 'setItem'); // To not alter the real localStorage on the browser
      store.UpdateCart(products);
      expect(store.cartItems()).toEqual(products);
      expect(localStorage.setItem).toHaveBeenCalledWith('products-cart', JSON.stringify(products)
      );
    });
  });

  describe('UpdateItemInCart', () => {
    it('should update the cart to have the item altered', () => {
      const products: Product[] = [
        createTestProduct({ id: 1, title: 'Product A', price: 20 }),
        createTestProduct({ id: 2, title: 'Product B', price: 40 }),
      ];
      store.TESTER_METHOD_Populate_CartItems(products);
      spyOn(localStorage, 'setItem'); // To not alter the real localStorage on the browser

      const changedProduct = { ...products[0], quantity: 3 };
      store.UpdateItemInCart(changedProduct);

      expect(store.cartItems()).toEqual([products[1], changedProduct]);
      expect(localStorage.setItem).toHaveBeenCalledWith('products-cart', JSON.stringify([products[1], changedProduct])
      );
    });
  });

  describe('DeleteSavedItems', () => {
    it('should delete all saved items', () => {
      const product1: Product = createTestProduct({ id: 1, title: 'Product A', price: 20 });
      const product2: Product = createTestProduct({ id: 2, title: 'Product B', price: 30 });

      // Add products to saved items
      store.SaveItem(product1);
      store.SaveItem(product2);

      // Assert saved items are added
      expect(store.savedItems()).toContain(product1);
      expect(store.savedItems()).toContain(product2);

      // Call DeleteSavedItems
      store.DeleteSavedItems();

      // Assert saved items are cleared
      expect(store.savedItems()).toEqual([]);
    });
  });


  describe('IsItemInCart', () => {
    // True
    it('should return true if the item is in cart', () => {
      const product: Product = createTestProduct({ id: 1, title: 'Product A', price: 20 });
      spyOn(localStorage, 'setItem'); // To not alter the real localStorage on the browser
      store.AddItemToCart(product);
      expect(store.IsItemInCart(product.id)).toBeTrue();
    });

    // False
    it('should return false if an item is not in the cart', () => {
      const productId = 1;
      expect(store.IsItemInCart(productId)).toBeFalse();
    });
  });

  describe('IsItemSaved', () => {
    // True
    it('should return true if an item is saved', () => {
      const product: Product = createTestProduct({ id: 1, title: 'Product A', price: 20 });
      store.SaveItem(product);
      expect(store.IsItemSaved(product.id)).toBeTrue();
    });

    // False
    it('should return false if an item is not saved', () => {
      const productId = 99; // Nonexistent product ID.
      expect(store.IsItemSaved(productId)).toBeFalse();
    });
  });

  describe('CloseMobileNavigation', () => {
    it('should close mobile navigation', () => {
      store.CloseMobileNavigation();
      expect(store.isPreviewDisplayed()).toBeTrue();
    });
  });

  describe('OpenMobileNavigation', () => {
    it('should open mobile navigation', () => {
      store.OpenMobileNavigation();
      expect(store.isPreviewDisplayed()).toBeFalse();
    });
  });

});
