import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SiginService {

  constructor(
    private http: HttpClient,
  ) { }
  
  postEndpoint = 'http://localhost:8000/';
	checkLogin = (): Promise<boolean> => {
    return this.http.
	}
}
