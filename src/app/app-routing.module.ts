import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { RegistrationComponent } from './registration/registration.component';


const routes: Routes = [
  {path: 'details', component: VehicleDetailsComponent},
  {path: 'register', component: RegistrationComponent},
  {path: '', redirectTo: 'details', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
