export interface RegistrationDetail {
    licence_plate_number: string;
    licence_plate_registration_details: VehicleDetail;
}

export interface VehicleDetail {
    licence_plate_number: string;
    registered_person_name: string;
    registered_person_flat_number: string;
    registered_person_phone_number: string;
}