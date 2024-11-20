import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';


export interface CustomJwtPayload {
  sub: number;
  user: string;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class JwtDecodeService {

  fetchSubject(jwtToken: string) {
    const username = jwt_decode.jwtDecode<CustomJwtPayload>(jwtToken).user;
    return username;
  }
}
