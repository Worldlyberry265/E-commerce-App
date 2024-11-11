import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';


// export interface DecodedJwt {
//   userId: string;
//   // add any other fields present in the JWT payload
// }

@Injectable({
  providedIn: 'root'
})
export class JwtDecodeService {

  fetchSubject(jwtToken: string) {
    const userID = +(jwt_decode.jwtDecode(jwtToken).sub ?? 0);
    return userID;
  }
}
