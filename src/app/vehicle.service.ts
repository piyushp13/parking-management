import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { VehicleDetail } from './models/vehicle-details';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  public currentRoute = new BehaviorSubject('details');
  constructor(private _http: HttpClient) { }

  getVehicleDetails(formData: FormData) {
    const vehicleDetailsUrl = `${environment.restUrl}/LicencePlateRecognition/file/isregistered_v2`;
    return this._http.post(vehicleDetailsUrl, formData);
  }

  getRegisteredVehiclesList() {
    const registeredVehiclesUrl = `${environment.restUrl}/LicencePlateRegistration/register`;
    return this._http.get(registeredVehiclesUrl);
  }

  resgisterVehicle(vehicleRegistrationData: VehicleDetail) {
    const registeredVehiclesUrl = `${environment.restUrl}/LicencePlateRegistration/register`;
    return this._http.put(registeredVehiclesUrl, vehicleRegistrationData);
  }

  deleteVehicle(licencePlateNumber: string) {
    const deleteVehicleUrl = `${environment.restUrl}/LicencePlateRegistration/${licencePlateNumber}`;
    return this._http.delete(deleteVehicleUrl);
  }
}
