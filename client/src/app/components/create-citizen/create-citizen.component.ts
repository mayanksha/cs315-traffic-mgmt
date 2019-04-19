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

export interface LicenseType {
  value: string;
  viewValue: string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-citizen',
  templateUrl: './create-citizen.component.html',
  styleUrls: ['./create-citizen.component.css']
})
export class CreateCitizenComponent implements OnInit {
  form: FormGroup;
  spinnerStatus = 0;
  postEndpoint = 'http://localhost:8000/';
  Ltypes: LicenseType[] = [
    {value: 'MC_50CC' , viewValue:'Motorcycle 50cc'},
    {value: 'MC_EX50CC', viewValue:'Motorcycle more than 50cc'},
    {value: 'MCWOG', viewValue:'Motorcycle Without Gear'},
    {value: 'MCWG', viewValue:'Motorcycle With Gear'},
    {value: 'LMV', viewValue:'Light Motor Vehicle'},
    {value: 'LMV_NT', viewValue:'Light Motor Vehicle—Non Transport'},
    {value: 'LMV_TR', viewValue:'Light Motor Vehicle—Transpor'},
    {value: 'LDRXCV', viewValue:'Loader, Excavator, Hydraulic Equipments'},
    {value: 'HMV', viewValue:'Heavy Motor Vehicle'},
    {value: 'HPMV', viewValue:'Heavy Passenger Motor Vehicle'},
    {value: 'HTV', viewValue:'Heavy Goods Motor Vehicle, Heavy Passenger Motor Vehicle'},
    {value: 'TRANS', viewValue:'Heavy Goods Motor Vehicle, Heavy Passenger Motor Vehicle'},
    {value: 'TRAILERE', viewValue:'A person holding a heavy vehicle driving licence can only apply for heavy trailer licence'}

  ];

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
      Name : ['', [Validators.required]],
      Address : ['', [Validators.required]],
      PhoneNumber : ['',[Validators.required]],
      Email : ['',[Validators.required, Validators.email]],
      VehicleNo : ['', [Validators.required]],
      LicenseType : ['',Validators.required], //TODO:Implement Selector
      Ltype : [this.Ltypes[0].value, Validators.required]
    });

  }

  onSubmit() {
    console.log(this.form.value);
    this.spinnerStatus = 1;
  }
}
