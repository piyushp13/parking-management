import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VehicleService } from '../vehicle.service';
import { MatSnackBar } from '@angular/material';
import { VehicleDetail } from '../models/vehicle-details';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss']
})
export class VehicleDetailComponent implements OnInit {
  vehicleEntryForm: FormGroup;
  @Input() vehicleData: VehicleDetail;
  @Input() mode: string;
  @Output() valueUpdated = new EventEmitter();
  constructor(private vehicleService: VehicleService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,) { }

  ngOnInit() {
    console.log(this.vehicleData);
    this.vehicleEntryForm = this.fb.group({
      licence_plate_number: [this.vehicleData ? this.vehicleData.licence_plate_number : '', Validators.required],
      registered_person_name: [this.vehicleData ? this.vehicleData.registered_person_name : '', Validators.required],
      registered_person_flat_number: [this.vehicleData ? this.vehicleData.registered_person_flat_number : '', Validators.required],
      registered_person_phone_number: [this.vehicleData ? this.vehicleData.registered_person_phone_number : '', Validators.required]
    });
  }

  registerVehicleUser() {
    this.vehicleService.resgisterVehicle(this.vehicleEntryForm.value).subscribe(result => {
      console.log('Created');
      this.snackBar.open('Vehicle Entry updated successfully', null, {
        duration: 1000,
        panelClass: 'success'
      });
      if (!this.vehicleData) {
        this.vehicleEntryForm.reset();
      } else {
        this.mode = 'display';
      }
      this.valueUpdated.emit('1');
    }, error => {
      this.valueUpdated.emit('0');
    });
  }

  resetVehicleForm() {
    this.vehicleEntryForm.reset();
  }

  deleteVehicleEntry(licencePlateNumber: string) {
    if (licencePlateNumber != "" && licencePlateNumber) {
      this.vehicleService.deleteVehicle(licencePlateNumber).subscribe(result => {
        this.snackBar.open('Vehicle Entry deleted successfully', null, {
          duration: 1000,
          panelClass: 'success'
        });
        this.valueUpdated.emit('1');
      }, error => {
        this.valueUpdated.emit('0');
      });
    } else {
      this.resetVehicleForm();
    }
  }
  
  cancelEdit() {
    if (this.vehicleData) {
      this.vehicleEntryForm.setValue(this.vehicleData);
      this.mode = 'display';
    } else {
      this.resetVehicleForm();
    }
  }

}
