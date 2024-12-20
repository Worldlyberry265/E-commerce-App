import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiEndpointsService {

  // General APIs
  private fakeStoreApi = 'https://fakestoreapi.com';
  private weatherApi = 'https://api.open-meteo.com/v1';

  // API Endpoints
  private fakeStoreApiUrl_Auth = `${this.fakeStoreApi}/auth`;
  private fakeStoreApiUrl_Users = `${this.fakeStoreApi}/users`;
  private fakeStoreApiUrl_Products = `${this.fakeStoreApi}/products`;
  private weatherApiUrl_Forcast = `${this.weatherApi}`;

  getLoginUrl(): string {
    return `${this.fakeStoreApiUrl_Auth}/login`;
  }

  getAddUserUrl(): string {
    return `${this.fakeStoreApiUrl_Users}`;
  }

  getAllProductsUrl(): string {
    return `${this.fakeStoreApiUrl_Products}`
  }

  getProductUrl(id: number): string {
    return `${this.fakeStoreApiUrl_Products}/${id}`
  }

  getCategoryProducts(category: string): string {
    return `${this.fakeStoreApiUrl_Products}/category/${category}`;
  }
  getWeatherCodes(coordinates: { latitude: number, longitude: number }): string {
    return `${this.weatherApiUrl_Forcast}/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&daily=weather_code`;
  }

}
