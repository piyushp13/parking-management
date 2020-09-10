import { Component, OnInit } from "@angular/core";
import { VehicleService } from "./vehicle.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
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

}
