import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormArray,
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  FormControl,
  NgForm,
  FormGroupDirective
} from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';

enum loginStatus {
  NOT_TRIED = 0,
  UNAUTHORIZED,
  AUTHORIZED,
  SERVER_ERROR,
  BAD_REQUEST,
  CRITICAL_ERROR
};

enum HTTP_RESPONSE_CODE {
  UNAUTHORIZED = 401,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED,
  BAD_GATEWAY
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit {
  form: FormGroup;
  status = loginStatus.NOT_TRIED;
  spinnerStatus = 0;
  postEndpoint = 'http://localhost:8000/';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email : ['', [ Validators.required,
        Validators.email
      ]],
      password : ['', [ Validators.required ]],
    });

    setTimeout((): void => {
      this.form.value.email = "msharma@iitk.ac.in";
      this.form.value.password = "lskdjfl";
      this.onSubmit();
    }, 1000);
  }

  onSubmit() {
    console.log(this.form.value);
    this.spinnerStatus = 1;
    return this.http.post(this.postEndpoint + 'signin', this.form.value).toPromise().then(val => {
      console.log(val);
      this.status = loginStatus.AUTHORIZED;
      setTimeout(() => this.spinnerStatus = 0, 1000);
    })
    .catch((err: HttpErrorResponse) => {
      if (err.status === HTTP_RESPONSE_CODE.UNAUTHORIZED) {
        this.status = loginStatus.UNAUTHORIZED                  
      } else if (err.status === HTTP_RESPONSE_CODE.BAD_REQUEST) {
        this.status = loginStatus.BAD_REQUEST                 
      } else if (
          err.status === HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR || 
          err.status === HTTP_RESPONSE_CODE.BAD_GATEWAY
        ) {
        this.status = loginStatus.SERVER_ERROR                 
      } else {
        this.status = loginStatus.CRITICAL_ERROR                 
        console.error(err);
      }
      setTimeout(() => this.spinnerStatus = 0, 1000);
    });
  }
}
