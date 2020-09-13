import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { VehicleDetail, RecognitionRequest } from './models/vehicle-details';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  public currentRoute = new BehaviorSubject('details');
  constructor(private _http: HttpClient) { }

  getVehicleDetailsAsFormData(formData: FormData) {
    const vehicleDetailsUrl = `${environment.restUrl}/LicencePlateRecognition/file/isregistered_v2`;
    return this._http.post(vehicleDetailsUrl, formData);
  }

  getVehicleDetails(recognitionRequest: RecognitionRequest) {
    const vehicleDetailsUrl = `${environment.restUrl}/LicencePlateRecognition/base64/isregistered_v2`;
    return this._http.post(vehicleDetailsUrl, recognitionRequest);
  }

  getRegisteredVehiclesList(): Observable<VehicleDetail[]> {
    const registeredVehiclesUrl = `${environment.restUrl}/LicencePlateRegistration/register`;
    return of([{
      licence_plate_number: "dkashk",
      registered_person_name: "kdsh kdhs",
      registered_person_flat_number: "dash",
      registered_person_phone_number: "7760967684"
    }, {
      licence_plate_number: "dkashk",
      registered_person_name: "kdsh kdhs",
      registered_person_flat_number: "dash",
      registered_person_phone_number: "7760967684"
    }, {
      licence_plate_number: "dkashk",
      registered_person_name: "kdsh kdhs",
      registered_person_flat_number: "dash",
      registered_person_phone_number: "7760967684"
    }, {
      licence_plate_number: "dkashk",
      registered_person_name: "kdsh kdhs",
      registered_person_flat_number: "dash",
      registered_person_phone_number: "7760967684"
    },{
      licence_plate_number: "dkashk",
      registered_person_name: "kdsh kdhs",
      registered_person_flat_number: "dash",
      registered_person_phone_number: "7760967684"
    }, {
      licence_plate_number: "dkashk",
      registered_person_name: "kdsh kdhs",
      registered_person_flat_number: "dash",
      registered_person_phone_number: "7760967684"
    }, {
      licence_plate_number: "dkashk",
      registered_person_name: "kdsh kdhs",
      registered_person_flat_number: "dash",
      registered_person_phone_number: "7760967684"
    }, {
      licence_plate_number: "dkashk",
      registered_person_name: "kdsh kdhs",
      registered_person_flat_number: "dash",
      registered_person_phone_number: "7760967684"
    },{
      licence_plate_number: "dkashk",
      registered_person_name: "kdsh kdhs",
      registered_person_flat_number: "dash",
      registered_person_phone_number: "7760967684"
    }, {
      licence_plate_number: "dkashk",
      registered_person_name: "kdsh kdhs",
      registered_person_flat_number: "dash",
      registered_person_phone_number: "7760967684"
    }, {
      licence_plate_number: "dkashk",
      registered_person_name: "kdsh kdhs",
      registered_person_flat_number: "dash",
      registered_person_phone_number: "7760967684"
    }, {
      licence_plate_number: "dkashk",
      registered_person_name: "kdsh kdhs",
      registered_person_flat_number: "dash",
      registered_person_phone_number: "7760967684"
    }]);
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
