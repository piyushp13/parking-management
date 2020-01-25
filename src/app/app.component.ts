import { Component, OnInit, AfterViewInit } from "@angular/core";
import { VehicleService } from "./vehicle.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "parking-management";
  isImageSelected = false;
  formData: FormData = new FormData();
  logData = "";
  vehicles = [];
  isLoading = false;
  links = [
    {path: 'details', label: 'Details'},
    {path: 'register', label: 'Registration'},
  ];
  activeLink = this.links[0].path;
  constructor(private vehicleService: VehicleService) {
      this.vehicleService.currentRoute.subscribe(currentRoute => {
        this.activeLink = currentRoute;
      });
  }

  ngOnInit() {}

  showImagePreview(event) {
    const imageFile = event.target.files ? event.target.files[0] : null;
    const imageContainer = document.querySelector("#image-preview");
    // if (imageContainer) {
    //   const image = document.querySelector('img');
    //   imageContainer.removeChild(image);
    // }
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (readEvent: any) => {
        const result = readEvent.target.result;
        const imgElement = new Image();
        imgElement.onload = () => {
          const widthRatio =
            imgElement.naturalWidth / imageContainer.clientWidth;
          const heightRatio =
            imgElement.naturalHeight / imageContainer.clientHeight;
          if (widthRatio > heightRatio) {
            imgElement.setAttribute("width", "100%");
            imgElement.setAttribute("height", "auto");
          } else {
            imgElement.setAttribute("height", "100%");
            imgElement.setAttribute("width", "auto");
          }
        };
        imgElement.src = result;
        this.isImageSelected = true;
        setTimeout(() => {
          imageContainer.appendChild(imgElement);
          if (this.formData.has("image_file")) {
            this.formData.append("image_file", imageFile);
          } else {
            this.formData.set("image_file", imageFile);
          }
          this.formData.set("id", new Date().getTime().toString());
        }, 0);
      };
      reader.readAsDataURL(imageFile);
    }
  }
  getDetails() {
    this.isLoading = true;
    this.vehicleService
      .getVehicleDetails(this.formData)
      .subscribe((result: { id: string; registration_details: RegistrationDetail[] }) => {
        for (let i = 0; i < 15; i++) {
          this.vehicles.push(result.registration_details[0]);
        }
        this.isLoading = false;
      });
  }
}

export interface RegistrationDetail {
  licence_plate_number: string;
  licence_plate_registration_details: {
    licence_plate_number: string;
    registered_person_name: string;
    registered_person_flat_number: string;
    registered_person_phone_number: string;
  };
}
