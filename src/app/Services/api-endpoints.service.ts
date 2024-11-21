import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiEndpointsService {

  private fakeStoreApi = 'https://fakestoreapi.com';

  private fakeStoreApiUrl_Auth = `${this.fakeStoreApi}/auth`;
  private fakeStoreApiUrl_Users = `${this.fakeStoreApi}/users`;
  private fakeStoreApiUrl_Products = `${this.fakeStoreApi}/products`;

  getLoginUrl() : string {
    return `${this.fakeStoreApiUrl_Auth}/login`;
  }

  getAddUserUrl(): string {
    return `${this.fakeStoreApiUrl_Users}`;
  }

  getAllProductsUrl() : string {
    return `${this.fakeStoreApiUrl_Products}`
  }

  getProductUrl(id : number | string) : string {
    return `${this.fakeStoreApiUrl_Products}/${id}`
  }

  getCategoryProducts(category : string) : string {
    return `${this.fakeStoreApiUrl_Products}/category/${category}`;
  }

}
