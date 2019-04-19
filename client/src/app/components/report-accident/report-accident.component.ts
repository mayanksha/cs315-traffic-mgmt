import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
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
export interface DialogData {
  date: string;
  coordinates: {
    latitude: number,
    longitude: number,
  };
  description: string
}

@Component({
  selector: 'app-report-accident',
  templateUrl: './report-accident.component.html',
  styleUrls: ['./report-accident.component.css']
})
export class ReportAccidentComponent implements OnInit {

 postEndpoint = 'http://localhost:8000/';
  spinnerStatus = 0;
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ReportAccidentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private http: HttpClient 
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  async ngOnInit() {
    this.form = this.fb.group({
      description : ['', Validators.required ],
      latitude : [34.43534, [ Validators.required ]],
      longitude : [34.43534, [ Validators.required ]],
      dueDate : ['', [Validators.required]],
    });
  }
  onSubmit() {
    console.log(this.form.value);
    this.spinnerStatus = 1;
    let req = {
      description: this.form.value.description,
      coordinates: {
        latitude: this.form.value.latitude,
        longitude: this.form.value.longitude,
      },
      dueDate: this.form.value.dueDate
    }

    setTimeout(() => {
      this.dialogRef.close();
    }, 1500);

    this.http.post(this.postEndpoint + 'reportAccident', req, {withCredentials: true}).toPromise()
      .then((val) => {
        console.log(val); 
      })
      .catch(console.error)
  }
}

