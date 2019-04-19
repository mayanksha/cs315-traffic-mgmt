import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/signup/signup.component';
import { CreateChallanComponent } from './components/create-challan/create-challan.component';
import { CreateCitizenComponent } from './components/create-citizen/create-citizen.component';
import { MapsComponent } from './components/maps/maps.component';
import { HomeComponent } from './components/home/home.component';
import { CitizenDashboardComponent } from './components/citizen-dashboard/citizen-dashboard.component';
import { ReportAccidentComponent } from './components/report-accident/report-accident.component';
import { RtoDashboardComponent } from './components/rto-dashboard/rto-dashboard.component';
import { PoliceDashboardComponent } from './components/police-dashboard/police-dashboard.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'createChallan', component: CreateChallanComponent, canActivate: [AuthGuard] },
  { path: 'createCitizen', component: CreateCitizenComponent, canActivate: [AuthGuard] },
  { path: 'citizenDashboard', component: CitizenDashboardComponent, canActivate: [AuthGuard] },
  { path: 'rtoDashboard', component: RtoDashboardComponent, canActivate: [AuthGuard] },
  { path: 'policeDashboard', component: PoliceDashboardComponent, canActivate: [AuthGuard] },
  { path: 'reportAccident', component: ReportAccidentComponent, canActivate: [AuthGuard] },
  { path: 'maps', component: MapsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
