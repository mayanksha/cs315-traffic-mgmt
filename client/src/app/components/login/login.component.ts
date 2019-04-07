import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  success: number;
  postEndpoint = 'http://localhost:8000';

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
  }

  onSubmit() {
    console.log(this.form.value);
    return this.http.post(this.postEndpoint + 'login', this.form.value).toPromise().then(val => {
      this.success = 1;
      console.log('Value Posted Successfully');
    }
    )
    .catch(err => {
      this.success = 2;
      console.error(err);
    });
  }
}
