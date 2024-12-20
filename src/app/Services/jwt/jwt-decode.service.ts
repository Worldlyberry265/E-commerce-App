import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';


export interface CustomJwtPayload {
  sub: number;
  user: string;
  iat: number;
}

// Added this to solve the errr "jwtDecode is not declared writable or has no setter" at testing
export const JwtDecodeWrapper = {
  jwtDecode: jwt_decode.jwtDecode,
};

@Injectable({
  providedIn: 'root'
})
export class JwtDecodeService {

  fetchSubject(jwtToken: string) {
    const username = JwtDecodeWrapper.jwtDecode<CustomJwtPayload>(jwtToken).user;
    return username;
  }
}
