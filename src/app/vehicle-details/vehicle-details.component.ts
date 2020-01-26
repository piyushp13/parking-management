import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../vehicle.service';
import { RegistrationDetail } from '../models/vehicle-details';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent implements OnInit {

  isImageSelected = false;
  formData: FormData = new FormData();
  logData = "";
  vehicles = [];
  isLoading = false;
  constructor(private vehicleService: VehicleService,
    private router: Router) {
      this.vehicleService.currentRoute.next(this.router.url.slice(1));
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
          if (this.formData.has("image_file")) {
            imageContainer.removeChild(document.querySelector('img'));
            imageContainer.appendChild(imgElement);
          } else {
            imageContainer.appendChild(imgElement);
          }
          this.formData.set("image_file", imageFile);
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
        this.vehicles = result.registration_details;
        this.isLoading = false;
      });
  }
}

