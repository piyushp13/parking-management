import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private _http: HttpClient) { }

  getVehicleDetails(formData: FormData) {
    const vehicleDetailsUrl = `${environment.restUrl}/LicencePlateRecognition/file/isregistered_v2`;
    return this._http.post(vehicleDetailsUrl, formData);
  }
}
