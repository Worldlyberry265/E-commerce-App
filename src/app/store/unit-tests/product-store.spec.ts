import { TestBed } from '@angular/core/testing';
import { delay, of } from 'rxjs';
import { ProductStore } from '../product.store';
import { HttpClientService } from '../../services/http.client';
import { createTestProduct, Product } from '../../models/Product';

describe('ProductStore', () => {
    let store: InstanceType<typeof ProductStore>;
    let httpClientServiceMock: jasmine.SpyObj<HttpClientService>;


    beforeEach(() => {
        httpClientServiceMock = jasmine.createSpyObj<HttpClientService>(
            'httpClientServiceMock',
            ['getAllProducts', 'getCategoryProducts', 'getProduct']
        );

        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClientService, useValue: httpClientServiceMock }
            ]
        });
        store = TestBed.inject(ProductStore);
    });

    // Testing Initial State
    it('should initialize with default state', () => {
        expect(store.products()).toEqual(null);
        expect(store.searchedProducts()).toEqual(null);
        expect(store.selectedProduct()).toEqual(null);
        expect(store.selectedCategory()).toEqual('');
        expect(store.relatedProducts()).toEqual(null);
        expect(store.loading()).toEqual(false);
    });

    describe('FetchAllProducts', () => {
        it('should set loading to true, fetch products and update the state', (done) => {
            const products: Product[] = [
                createTestProduct({ id: 1, title: 'Product 1', price: 100 }),
                createTestProduct({ id: 2, title: 'Product 2', price: 200 }),
            ];

            // Added the delay and the timeout to test the changes of the loading state
            httpClientServiceMock.getAllProducts.and.returnValue(of(products).pipe(delay(10)));

            // Assert loading is initially false
            expect(store.loading()).toBe(false);
            store.FetchAllProducts()
            // Assert loading is true immediately after calling the method
            expect(store.loading()).toBe(true);

            setTimeout(() => {
                expect(httpClientServiceMock.getAllProducts).toHaveBeenCalled();
                expect(store.products()).toEqual(products);
                expect(store.relatedProducts()).toEqual(products);
                expect(store.searchedProducts()).toEqual(null);
                expect(store.selectedCategory()).toEqual('');
                expect(store.loading()).toBe(false);
                done(); // since its not returning an observable or a promise, then we need to tell Jasmine when to stop
            }, 20); // Slightly longer than the delay in the mocked observable
        });
    });

    describe('FetchCategoryProducts', () => {
        it('should set loading to true, fetch products for a category and update the state', (done) => {
            const category = 'electronics';
            const products: Product[] = [
                createTestProduct({ id: 1, title: 'Product 1', price: 100 }),
                createTestProduct({ id: 2, title: 'Product 2', price: 200 }),
            ];

            // Added the delay and the timeout to test the changes of the loading state
            httpClientServiceMock.getCategoryProducts.and.returnValue(of(products).pipe(delay(10)));


            // Assert loading is initially false
            expect(store.loading()).toBe(false);
            store.FetchCategoryProducts(category);
            // Assert loading is true immediately after calling the method
            expect(store.loading()).toBe(true);


            setTimeout(() => {
                expect(httpClientServiceMock.getCategoryProducts).toHaveBeenCalledWith(category.toLowerCase());
                expect(store.products()).toEqual(products);
                expect(store.selectedCategory()).toBe(category.toLowerCase());
                expect(store.searchedProducts()).toBe(null);
                expect(store.loading()).toBe(false);
                done(); // since its not returning an observable or a promise, then we need to tell Jasmine when to stop
            }, 20); // Slightly longer than the delay in the mocked observable
        });
    });

    describe('SearchForProducts', () => {

        it('should clear search if empty string is passed', () => {

            // Assert loading is initially false
            expect(store.loading()).toBe(false);
            store.SearchForProducts('');

            expect(store.loading()).toBe(false);
            expect(store.searchedProducts()).toBeNull();
        });

        it('should search for products by name', () => {
            const products: Product[] = [
                createTestProduct({ id: 1, title: 'Product 1', price: 100 }),
                createTestProduct({ id: 2, title: 'Men Slim Tshirt', price: 200 }),
            ];

            // Assert loading is initially false
            expect(store.loading()).toBe(false);

            store.TESTER_METHOD_Populate_Products(products);

            store.SearchForProducts('Slim Tshirt');
            expect(store.searchedProducts()).toEqual([{ ...products[1] }]);
            expect(store.loading()).toBe(false);
        });

        it('should search for products by product ID and already found in store', () => {
            const products: Product[] = [
                createTestProduct({ id: 1, title: 'Product 1', price: 100 }),
                createTestProduct({ id: 2, title: 'Men Slim Tshirt', price: 200 }),
            ];

            // Assert loading is initially false
            expect(store.loading()).toBe(false);

            store.TESTER_METHOD_Populate_Products(products);


            store.SearchForProducts(1);

            expect(store.searchedProducts()).toEqual([{ ...products[0], quantity: 1 }]);
            expect(store.loading()).toBe(false);
        });

        it('should fetch product by product ID and it is existent ', (done) => {
            const products: Product[] = [
                createTestProduct({ id: 1, title: 'Product 1', price: 100 }),
                createTestProduct({ id: 2, title: 'Men Slim Tshirt', price: 200 }),
            ];

            // Added the delay and the timeout to test the changes of the loading state
            httpClientServiceMock.getProduct.and.returnValue(of(products[0]).pipe(delay(10)));

            // Assert loading is initially false
            expect(store.loading()).toBe(false);
            store.SearchForProducts(1)
            // Assert loading is true immediately after calling the method
            expect(store.loading()).toBe(true);

            setTimeout(() => {
                expect(httpClientServiceMock.getProduct).toHaveBeenCalledWith(1);
                expect(store.searchedProducts()).toEqual([{ ...products[0] }]);
                expect(store.selectedProduct()).toEqual(products[0]);
                expect(store.loading()).toBe(false);
                done();
            }, 20); // Slightly longer than the delay in the mocked observable
        });

        it('should fetch product by product ID and it is not existent ', (done) => {
            const products: Product[] = [
                createTestProduct({ id: 1, title: 'Product 1', price: 100 }),
                createTestProduct({ id: 2, title: 'Men Slim Tshirt', price: 200 }),
            ];

            // Added the delay and the timeout to test the changes of the loading state
            httpClientServiceMock.getProduct.and.returnValue(of(null).pipe(delay(10)));

            // Assert loading is initially false
            expect(store.loading()).toBe(false);
            store.SearchForProducts(1)
            // Assert loading is true immediately after calling the method
            expect(store.loading()).toBe(true);

            setTimeout(() => {
                expect(httpClientServiceMock.getProduct).toHaveBeenCalledWith(1);
                expect(store.searchedProducts()).toEqual(null);
                expect(store.selectedProduct()).toEqual(null);
                expect(store.loading()).toBe(false);
                done();
            }, 20); // Slightly longer than the delay in the mocked observable
        });
    });
});
