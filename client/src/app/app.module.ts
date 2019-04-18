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
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    CreateChallanComponent,
    CreateCitizenComponent,
    MapsComponent,
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
