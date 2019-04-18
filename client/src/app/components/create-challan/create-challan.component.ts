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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-challan',
  templateUrl: './create-challan.component.html',
  styleUrls: ['./create-challan.component.css']
})
export class CreateChallanComponent implements OnInit {
  form: FormGroup;
  spinnerStatus = 0;
  postEndpoint = 'http://localhost:8000/';

  coord = {
    lat: '34.5654',
    long: '90.5647'
  }
  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      license : ['', [Validators.required]],
      fineAmount : ['', [Validators.required, Validators.min(0), Validators.max(100000)]],
      vehicleNo : ['', [Validators.required]],
      dueDate : ['', [Validators.required]],
      policeOfficer : ['', [Validators.required]],
      password : ['', [ Validators.required ]],
      latitude : [{value: '', disabled : true}, [ Validators.required ]],
      longitude : [{value: '', disabled : true}, [ Validators.required ]],
    });

  }

  onSubmit() {
    console.log(this.form.value);
    this.spinnerStatus = 1;
  }
}
