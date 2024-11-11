import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiEndpointsService {
  private fakeStoreApiUrl = 'https://fakestoreapi.com';

  getLoginUrl() : string {
    return `${this.fakeStoreApiUrl}/auth/login`;
  }

  getAddUserUrl(): string {
    return `${this.fakeStoreApiUrl}/users`;
  }

}
