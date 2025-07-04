import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../../services/vehicle.service';
import { Vehicle } from '../../../models/vehicle.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vs-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vs-list.component.html',
  styleUrls: ['./vs-list.component.css']
})
export class VsListComponent implements OnInit {
  vehicles: Vehicle[] = [];

  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.loadServiceVehicles();
  }

  loadServiceVehicles(): void {
    this.vehicleService.getServiceVehicles().subscribe(data => {
      this.vehicles = data;
    });
  }
}
