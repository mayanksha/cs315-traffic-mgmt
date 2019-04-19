import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ReportAccidentComponent } from '../report-accident/report-accident.component';
import { CreateCitizenComponent } from '../create-citizen/create-citizen.component';

import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn, FormControl, NgForm, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-rto-dashboard',
  templateUrl: './rto-dashboard.component.html',
  styleUrls: ['./rto-dashboard.component.css']
})
export class RtoDashboardComponent implements OnInit {
  postEndpoint = 'http://localhost:8000/';
  license: any;
  challans: any[];
  mapStatus = false;
  cDetails = false;
  byId = false;
  byAll = false;
  
  singleChallans: any[];
  cform: FormGroup; 
  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    public fb: FormBuilder,
  ) { }

  onSubmit() {
    this.http.post(this.postEndpoint + 'challanById', this.cform.value, {withCredentials: true}).toPromise()
      .then((val) => {
        console.log(val)
        this.singleChallans = (val as any);
      })
      .catch(console.error);
  }
  ctoggle() {
    this.cDetails = !this.cDetails;
  }
  toggleMap() {
    this.mapStatus = !this.mapStatus;
  }
  toggleId(){
    this.byId = !this.byId;
  }
  toggleAll(){
    this.byAll = !this.byAll;
    this.getChallan();
  }
  async ngOnInit() {
    this.cform = this.fb.group({
      license : ['', [ Validators.required ]]
    });
  }
  openLicenseCreation() {
    const dialogRef = this.dialog.open(CreateCitizenComponent, {
      width: '400px',
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ReportAccidentComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      /*this.animal = result;*/
    });
  }
  async getLicense() {
    this.license = await this.http.get(this.postEndpoint + 'getUserInfoByUser', { withCredentials: true })
      .toPromise()
    this.license.licenseDetails.expirationDate = new Date(this.license.licenseDetails.expirationDate);
  }
  viewMap() {
    setTimeout(() => {
      this.router.navigate(['/maps']);
    }, 1000);
  }
  async reportAccident() {
    this.license = await this.http.get(this.postEndpoint + 'getUserInfoByUser', { withCredentials: true })
      .toPromise()
    this.license.licenseDetails.expirationDate = new Date(this.license.licenseDetails.expirationDate);
  }
  async getChallan() {
    this.http.get(this.postEndpoint + 'allChallan', { withCredentials: true }).toPromise()
      .then((val) => {
        console.log(val)
        this.challans = (val as any);
      })
      .catch(console.error);
  }
  async payChallan(cid) {
    let req = {
      challanId: cid
    }
    this.http.post(this.postEndpoint + 'payChallan', req, { withCredentials: true }).toPromise()
      .then((val) => {
        console.log(val)
        /*this.challans = (val as any);*/
      })
      .catch(console.error);
  }
}

