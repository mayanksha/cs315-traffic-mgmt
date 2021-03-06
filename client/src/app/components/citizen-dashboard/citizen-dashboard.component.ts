import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ReportAccidentComponent } from '../report-accident/report-accident.component';

@Component({
  selector: 'app-citizen-dashboard',
  templateUrl: './citizen-dashboard.component.html',
  styleUrls: ['./citizen-dashboard.component.css']
})
export class CitizenDashboardComponent implements OnInit {
  postEndpoint = 'http://localhost:8000/';
  license: any;
  challans: any[];
  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {

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
    this.http.get(this.postEndpoint + 'challanByUser', { withCredentials: true }).toPromise()
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




