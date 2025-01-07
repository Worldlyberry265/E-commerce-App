import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { throwError } from 'rxjs';


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

  fetchId(jwtToken: string) {
    const id = JwtDecodeWrapper.jwtDecode<CustomJwtPayload>(jwtToken).sub;
    return id;
  }

  fetchGeneratedDate(jwtToken: string) {
    const iat = JwtDecodeWrapper.jwtDecode<CustomJwtPayload>(jwtToken).iat;
    return iat;
  }

  isJwtExpired(jwtToken: string): boolean {
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
    const expirationTime = this.fetchGeneratedDate(jwtToken) + 10 * 60; // Add 10 minutes
    // const expirationTime = this.fetchGeneratedDate(jwtToken) + 1; // Test Expired Jwt

    if (currentTime > expirationTime) {
      return true;
    }
    return false;
  }
}
