import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

export enum loginStatus {
  NOT_TRIED = 0,
    UNAUTHORIZED,
    AUTHORIZED,
    SERVER_ERROR,
    BAD_REQUEST,
    CRITICAL_ERROR
};

export enum HTTP_RESPONSE_CODE {
  UNAUTHORIZED = 401,
    BAD_REQUEST = 400,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED,
    BAD_GATEWAY
}

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  constructor(
    private http: HttpClient,
  ) { }

  postEndpoint = 'http://localhost:8000/';
  checkLogin = (): Promise<boolean> => {
    return this.http.get(this.postEndpoint + 'checkLogin', { withCredentials: true }).toPromise()
      .then(val => true)
      .catch(err => {
        console.error(err);
        return false;
      })
  }

  performLogin = (formVal): Promise<any> => {
    return this.http.post(this.postEndpoint + 'signin', formVal, { withCredentials: true }).toPromise()
  }
  logOut = (): Promise<any> => {
    return this.http.get(this.postEndpoint + 'signout', { withCredentials: true }).toPromise()
      .then(val => true)
      .catch(err => {
        console.error(err);
        return false;
      })
  }
}
