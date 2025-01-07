import { TestBed } from '@angular/core/testing';
import { ApiEndpointsService } from '../api-endpoints.service';

describe('ApiEndpointsService', () => {
    let service: ApiEndpointsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ApiEndpointsService],
        });
        service = TestBed.inject(ApiEndpointsService);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return the correct Login URL', () => {
        const expectedUrl = 'https://fakestoreapi.com/auth/login';
        expect(service.getLoginUrl()).toBe(expectedUrl);
    });

    it('should return the correct AddUser URL', () => {
        const expectedUrl = 'https://fakestoreapi.com/users';
        expect(service.getAddUserUrl()).toBe(expectedUrl);
    });

    it('should return the correct UpdateUser URL', () => {
        const expectedUrl = 'https://fakestoreapi.com/users/5';
        expect(service.getUpdateUserUrl(5)).toBe(expectedUrl);
    });

    it('should return the correct URL for fetching all products', () => {
        const expectedUrl = 'https://fakestoreapi.com/products';
        expect(service.getAllProductsUrl()).toBe(expectedUrl);
    });

    it('should return the correct URL for fetching a specific product by ID', () => {
        const productId = 5;
        const expectedUrl = `https://fakestoreapi.com/products/${productId}`;
        expect(service.getProductUrl(productId)).toBe(expectedUrl);
    });

    it('should return the correct URL for fetching products by category', () => {
        const category = 'electronics';
        const expectedUrl = `https://fakestoreapi.com/products/category/${category}`;
        expect(service.getCategoryProducts(category)).toBe(expectedUrl);
    });

    it('should return the correct weather forecast URL with coordinates', () => {
        const coordinates = { latitude: 40.7128, longitude: -74.0060 };
        const expectedUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&daily=weather_code`;
        expect(service.getWeatherCodes(coordinates)).toBe(expectedUrl);
    });
});
