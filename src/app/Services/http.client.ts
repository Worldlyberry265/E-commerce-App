import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiEndpointsService } from './api-endpoints.service';
import { User } from '../models/User';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private endpointGetterService = inject(ApiEndpointsService);
  private http = inject(HttpClient);


  // The postLogin takes an object in the parameters in the form of username and password which are both strings.
  // It expects the return type to be an object which has only a string variable called token.
  postLogin( {username , password} : {username : string , password : String}): Observable<{token : string}> {
    return this.http.post<{token : string}>(this.endpointGetterService.getLoginUrl(), {username : username , password : password});
  }

  postAddUser( user : User) {
    return this.http.post<{id : number}>(this.endpointGetterService.getAddUserUrl(), {username : user.email , password : user.password})
  }

  getAllProducts() {
    return this.http.get<Product[]>(this.endpointGetterService.getAllProductsUrl());
  }



//   login(loginData): Observable<string> {
//     return this.http.post(this.LoginURL, loginData, { responseType: "text" });
// }

//   getSingleUser(Id: number): Observable<any> {
//     return this.http.get<User>(SingleUserURL + Id);
//   }



}

