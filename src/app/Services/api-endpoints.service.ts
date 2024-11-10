import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiEndpointsService {
  private baseUrl = 'https://api.example.com';

  // Define URLs as methods for flexibility
  getUserUrl(userId: string): string {
    return `${this.baseUrl}/users/${userId}`;
  }

  getProductsUrl(): string {
    return `${this.baseUrl}/products`;
  }

  // More endpoint methods...
}
