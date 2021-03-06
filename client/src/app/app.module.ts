import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { SignInComponent } from './components/signin/signin.component';
import { AppRoutingModule } from './app-routing.module';

import {
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatToolbarModule,
  MatButtonModule,
  MatAutocompleteModule,
  MatInputModule,
  MatGridListModule,
  MatExpansionModule,
  MatCardModule,
  MatMenuModule,
  MatSidenavModule,
  MatSelectModule,
  MatRadioModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatCheckboxModule
} from '@angular/material';
import { SignUpComponent } from './components/signup/signup.component';
import { CreateChallanComponent } from './components/create-challan/create-challan.component';
import { CreateCitizenComponent } from './components/create-citizen/create-citizen.component';
import { MapsComponent } from './components/maps/maps.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { HomeComponent } from './components/home/home.component';
import { CitizenDashboardComponent } from './components/citizen-dashboard/citizen-dashboard.component';
import { ReportAccidentComponent } from './components/report-accident/report-accident.component';
import { RtoDashboardComponent } from './components/rto-dashboard/rto-dashboard.component';
import { PoliceDashboardComponent } from './components/police-dashboard/police-dashboard.component';
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    CreateChallanComponent,
    CreateCitizenComponent,
    MapsComponent,
    TopbarComponent,
    HomeComponent,
    CitizenDashboardComponent,
    ReportAccidentComponent,
    RtoDashboardComponent,
    PoliceDashboardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    MatCardModule,
    MatMenuModule,
    MatSidenavModule,
    MatSelectModule,
    MatRadioModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
