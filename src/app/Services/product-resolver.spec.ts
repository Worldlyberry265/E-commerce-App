import { ProductStore } from '../store/product.store';
import { ActivatedRouteSnapshot } from '@angular/router';
import { productResolver } from './product-resolver';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Injector, runInInjectionContext } from '@angular/core';


describe('Product Resolver', () => {
    let mockProductStore: InstanceType<typeof ProductStore>;
    let routeSnapshot: ActivatedRouteSnapshot;
    let injector: Injector;

    beforeEach(() => {
        routeSnapshot = { params: { id: '1' } } as any; // Mock ActivatedRouteSnapshot

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
            ],
        });

        mockProductStore = TestBed.inject(ProductStore);
        injector = TestBed.inject(Injector);
    });

    it('should call SearchForProducts with the correct ID', () => {

        mockProductStore = TestBed.inject(ProductStore);
        spyOn(mockProductStore, 'SearchForProducts');

        // Using runInInjectionContext to ensure inject() is called within the proper context
        // since we are injecting the productStore inside the resolver function
        runInInjectionContext(injector, () => {
            // Call the resolver function inside the injection context
            productResolver(routeSnapshot);
        });

        // Assert that SearchForProducts was called with the correct ID
        expect(mockProductStore.SearchForProducts).toHaveBeenCalledWith(1);
    });
});
