import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/signup/signup.component';
import { CreateChallanComponent } from './components/create-challan/create-challan.component';
import { CreateCitizenComponent } from './components/create-citizen/create-citizen.component';

const routes: Routes = [
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'createChallan', component: CreateChallanComponent },
  { path: 'createCitizen', component: CreateCitizenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
