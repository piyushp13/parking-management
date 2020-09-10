import { Component, OnInit } from "@angular/core";
import { VehicleService } from "../vehicle.service";
import { RegistrationDetail, RecognitionRequest } from "../models/vehicle-details";
import { Router } from "@angular/router";
import { OrientationFixer } from "../image-utilities/orientation-fixer";

@Component({
  selector: "app-vehicle-details",
  templateUrl: "./vehicle-details.component.html",
  styleUrls: ["./vehicle-details.component.scss"]
})
export class VehicleDetailsComponent implements OnInit {
  isImageSelected = false;
  formData: FormData = new FormData();
  recognitionRequest : RecognitionRequest;
  logData = "";
  vehicles = [];
  isLoading = false;
  loadingImage = false;
  constructor(private vehicleService: VehicleService, private router: Router) {
    this.vehicleService.currentRoute.next(this.router.url.slice(1));
  }

  ngOnInit() {}

  dataURItoBlob(dataURI: string) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
  
    // create a view into the buffer
    var ia = new Uint8Array(ab);
  
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  
  }

  showImagePreview(event) {
    console.log('Image preview ');
    this.loadingImage = true;
    this.isImageSelected = true;
    const imageFile = event.target.files ? event.target.files[0] : null;
    const imageContainer = document.querySelector("#image-preview");
    if (imageFile) {
      const imgElement = new Image();
      let base64Img;
      OrientationFixer.getCorrectlyOrientedImage(imageFile, 1000).then(
        fixedImageDataUrl => {
          base64Img = fixedImageDataUrl;
          // console.log('Image preview ', base64Img);
        }
      ).catch(error => {
        base64Img = error;
      }).finally(() => {
        imgElement.src = base64Img;
        // console.log('Image: ', base64Img);
      });
      imgElement.onload = () => {
        const widthRatio = imgElement.naturalWidth / imageContainer.clientWidth;
        const heightRatio =
          imgElement.naturalHeight / imageContainer.clientHeight;
        if (widthRatio > heightRatio) {
          imgElement.setAttribute("width", "100%");
          imgElement.setAttribute("height", "auto");
        } else {
          imgElement.setAttribute("height", "100%");
          imgElement.setAttribute("width", "auto");
        }
        this.loadingImage = false;
        if (this.formData.has('image_file')) {
          imageContainer.removeChild(document.querySelector("img"));
          imageContainer.appendChild(imgElement);
        } else {
          imageContainer.appendChild(imgElement);
        }
        const timeStamp = new Date().getTime().toString();
        this.formData.set('id', timeStamp);
        const modifiedImageFile = new File([this.dataURItoBlob(base64Img)], imageFile.name);
        this.formData.set('image_file', modifiedImageFile);
        // this.recognitionRequest = {id: timeStamp, base64ImageString: base64Img.replace('data:image/jpeg;base64,', '')};
      };
    }
  }

  getDetails() {
    this.isLoading = true;
    this.vehicleService
      .getVehicleDetailsAsFormData(this.formData)
      .subscribe(
        (result: {
          id: string;
          registration_details: RegistrationDetail[];
        }) => {
          this.vehicles = result.registration_details;
          this.isLoading = false;
        }
      );
  }
}
