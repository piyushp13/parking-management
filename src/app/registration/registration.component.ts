import { Component, AfterViewInit } from '@angular/core';
import { VehicleService } from '../vehicle.service';
import { VehicleDetail } from '../models/vehicle-details';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements AfterViewInit {
  isLoading = false;
  vehicles = [];
  isUserAddInProgress = false;
  constructor(private vehicleService: VehicleService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.vehicleService.currentRoute.next(this.router.url.slice(1));
  }

  ngAfterViewInit() {
    this.getRegisteredVehicles();
  }

  getRegisteredVehicles() {
    this.isLoading = true;
    this.vehicleService
      .getRegisteredVehiclesList()
      .subscribe((result: VehicleDetail[] ) => {
        this.vehicles = result;
        this.isLoading = false;
      });
  }

  refreshView(event) {
    console.log('Event emitted', event);
    if (event == 1) {
      this.getRegisteredVehicles();
    }
  }

}
