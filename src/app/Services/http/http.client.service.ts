import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpointsService } from './api-endpoints.service';
import { User } from '../../models/User';
import { Product } from '../../models/Product';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private endpointGetterService = inject(ApiEndpointsService);
  private http = inject(HttpClient);



  // The postLogin takes an object in the parameters in the form of username and password which are both strings.
  // It expects the return type to be an object which has only a string variable called token.
  postLogin({ username, password }: { username: string, password: String }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.endpointGetterService.getLoginUrl(), { username: username, password: password });
  }

  postAddUser(user: User) {
    return this.http.post<{ id: number }>(this.endpointGetterService.getAddUserUrl(), { username: user.email, password: user.password })
  }

  patchUpdateUser(password: string, userId: number): Observable<Object> {
    return this.http.patch<Object>(
      this.endpointGetterService.getUpdateUserUrl(userId),
      { password: password },
      {
        headers: {
          Authorization: `Bearer `, // We'll manually attach the JWT in the interceptor
        }
      }
    );
  }


  getAllProducts() {
    return this.http.get<Product[]>(this.endpointGetterService.getAllProductsUrl());
  }

  getProduct(id: number) { // Product or null because fakestoreapi returns nothing/null if the product wasnt found
    return this.http.get<Product | null>(this.endpointGetterService.getProductUrl(id));
  }

  getCategoryProducts(category: string) {
    return this.http.get<Product[]>(this.endpointGetterService.getCategoryProducts(category));
  }
  getWeatherCodes(coordinates: { latitude: number, longitude: number }) {
    return this.http.get(this.endpointGetterService.getWeatherCodes(coordinates));
  }

}

