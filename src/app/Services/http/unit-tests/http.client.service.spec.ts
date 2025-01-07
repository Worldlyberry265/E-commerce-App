import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientService } from '../http.client.service';
import { ApiEndpointsService } from '../api-endpoints.service';
import { User } from '../../../models/User';
import { createTestProduct, Product } from '../../../models/Product';
import { provideHttpClient } from '@angular/common/http';

describe('HttpClientService', () => {
    let httpClientService: HttpClientService;

    let httpTestingController: HttpTestingController;
    let apiEndpointsService: ApiEndpointsService;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ],
        });

        httpClientService = TestBed.inject(HttpClientService);
        httpTestingController = TestBed.inject(HttpTestingController);
        apiEndpointsService = TestBed.inject(ApiEndpointsService);
    });

    afterEach(() => {
        httpTestingController.verify(); // Ensure no outstanding requests
    });

    it('should send a POST request to login and generate jwt', () => {
        const loginData = { username: 'testuser', password: 'testpassword' };
        const mockResponse = { token: 'abc123' };

        httpClientService.postLogin(loginData).subscribe(tokenData =>
            expect(tokenData).toEqual(mockResponse)
        );

        const req = httpTestingController.expectOne(apiEndpointsService.getLoginUrl());
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(loginData);

        // simulates the backend by returning the mockResponse
        req.flush(mockResponse);
    });


    it('should send a POST request to add a new user', () => {
        const mockUser: User = { email: 'test@example.com', password: '123456' };
        const mockResponse = { id: 1 };

        httpClientService.postAddUser(mockUser).subscribe((userId: { id: number }) => {
            expect(userId.id).toEqual(mockResponse.id);
        });

        const req = httpTestingController.expectOne(apiEndpointsService.getAddUserUrl());
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
            username: mockUser.email,
            password: mockUser.password,
        });

        // simulates the backend by returning the mockResponse
        req.flush(mockResponse);
    });

    it('should send a PATCH request to update user password', () => {
        const password = 'Newpassword123!';
        const userId = 1;
        const mockResponse = { password: 'Newpassword123!' }; // fakestoreapi returns the updated fields as a response

        httpClientService.patchUpdateUser(password, userId).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpTestingController.expectOne(apiEndpointsService.getUpdateUserUrl(userId));
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual({ password: password });
        expect(req.request.headers.has('Authorization')).toBeTrue();
        expect(req.request.headers.get('Authorization')).toBe('Bearer ');

        // Simulate the backend response
        req.flush(mockResponse);
    });


    it('should get all products', () => {
        const mockProducts: Product[] = [
            createTestProduct({ id: 1, title: 'Product 1', price: 100 }),
            createTestProduct({ id: 2, title: 'Product 2', price: 200 }),
        ];

        httpClientService.getAllProducts().subscribe((products) => {
            expect(products).toEqual(mockProducts);
        });

        const req = httpTestingController.expectOne(apiEndpointsService.getAllProductsUrl());
        expect(req.request.method).toBe('GET');

        // simulates the backend by returning the mockResponse
        req.flush(mockProducts);
    });

    it('should get a product by ID', () => {
        const productId = 1;
        const mockProduct: Product = createTestProduct({ id: 1, title: 'Product 1', price: 100 });

        httpClientService.getProduct(productId).subscribe((product) => {
            expect(product).toEqual(mockProduct);
        });

        const req = httpTestingController.expectOne(apiEndpointsService.getProductUrl(productId));
        expect(req.request.method).toBe('GET');

        // simulates the backend by returning the mockResponse
        req.flush(mockProduct);
    });

    it('should get products by category', () => {
        const category = 'electronics';
        const mockProducts: Product[] = [
            createTestProduct({ id: 1, title: 'Laptop', price: 1500 }),
            createTestProduct({ id: 2, title: 'Smartphone', price: 800 }),
        ];

        httpClientService.getCategoryProducts(category).subscribe((products) => {
            expect(products).toEqual(mockProducts);
        });

        const req = httpTestingController.expectOne(apiEndpointsService.getCategoryProducts(category));
        expect(req.request.method).toBe('GET');

        // simulates the backend by returning the mockResponse
        req.flush(mockProducts);
    });

    it('should get weather codes for coordinates', () => {
        const coordinates = { latitude: 40.7128, longitude: -74.0060 };
        const mockResponse = { weatherCode: 'Sunny' };

        httpClientService.getWeatherCodes(coordinates).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpTestingController.expectOne(apiEndpointsService.getWeatherCodes(coordinates));
        expect(req.request.method).toBe('GET');

        // simulates the backend by returning the mockResponse
        req.flush(mockResponse);
    });
});
