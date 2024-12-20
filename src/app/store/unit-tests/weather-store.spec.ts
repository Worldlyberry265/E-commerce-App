import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpClientService } from '../../services/http/http.client.service';
import { WeatherStore } from '../weather.store'
import { createTestProduct, Product } from '../../models/Product';


describe('WeatherStore', () => {
    let store: InstanceType<typeof WeatherStore>;
    let httpClientServiceMock: jasmine.SpyObj<HttpClientService>;

    beforeEach(() => {
        httpClientServiceMock = jasmine.createSpyObj<HttpClientService>(
            'HttpClientService',
            ['getWeatherCodes', 'getProduct']
        );

        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClientService, useValue: httpClientServiceMock }
            ]
        });

        store = TestBed.inject(WeatherStore);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    // Testing Initial State
    it('should initialize with default state', () => {
        expect(store.weatherCodes()).toEqual([]);
        expect(store.menFramedProduct()).toEqual(null);
        expect(store.womenFramedProduct()).toEqual(null);
    });

    describe('GetWeatherCodes', () => {
        // Location Permission Granted
        it('should fetch weather codes and update state', () => {
            // Mock `navigator.geolocation`
            spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success, error) => {
                const mockPosition: GeolocationPosition = {
                    coords: {
                        latitude: 40.7128,
                        longitude: -74.0060,
                        accuracy: 10,
                        altitude: null,
                        altitudeAccuracy: null,
                        heading: null,
                        speed: null,
                    }
                } as any; // any to avoid declaring the rest of the properties
                success(mockPosition);
            });

            // Mock `getWeatherCodes` API call
            const mockWeatherCodes = { daily: { weather_code: [1, 2, 3] } };
            httpClientServiceMock.getWeatherCodes.and.returnValue(of(mockWeatherCodes));

            // Call method and verify state update
            store.GetWeatherCodes();
            expect(store.weatherCodes()).toEqual([1, 2, 3]);
        });

        // Location Permission Denied
        it('should fetch default products when geolocation fails', () => {
            // Mock `navigator.geolocation.getCurrentPosition` to simulate an error
            spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success, error) => {
                if (error) {
                    error({
                        alert: "Please enable location to have the best experience",
                    } as any);
                }
            });

            // Mock the `GetFramedProducts` method
            spyOn(store, 'GetFramedProducts').and.callThrough(); // This spies on the method

            const menProduct = createTestProduct({ id: 1, title: 'Product 1' }); // mock product for both men and women
            const womenProduct = createTestProduct({ id: 20, title: 'Product 20' }); // mock product for both men and women

            // Mock `GetFramedProducts` API call
            httpClientServiceMock.getProduct.and.callFake((id: number) => {
                if (id === 1) return of(menProduct);
                if (id === 20) return of(womenProduct);
                return throwError(() => new Error('Product not found'));
            });

            // Call method and verify the products are fetched
            store.GetWeatherCodes();

            // Check that both men and women framed products were fetched
            expect(store.weatherCodes()).toEqual([]);
            expect(store.menFramedProduct()).toEqual(menProduct);
            expect(store.womenFramedProduct()).toEqual(womenProduct);
        });
    });

    describe('GetFramedProducts', () => {
        it('should fetch products and update state', () => {
            // Mock `getProduct` API calls
            const menProduct: Product = createTestProduct({ id: 1, title: 'Men Product' });
            const womenProduct: Product = createTestProduct({ id: 2, title: 'Women Product' });
            httpClientServiceMock.getProduct.and.callFake((id: number) => {
                if (id === 1) return of(menProduct);
                if (id === 2) return of(womenProduct);
                return throwError(() => new Error('Product not found'));
            });

            // Call method and verify state update
            store.GetFramedProducts({ menProducId: 1, womenProductId: 2 });
            expect(store.menFramedProduct()).toEqual(menProduct);
            expect(store.womenFramedProduct()).toEqual(womenProduct);
        });
    });


});
