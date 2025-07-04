import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getVehicles(): Observable<Vehicle[]> {
    console.log('Fetching all vehicles...');
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicules`);
  }

  getServiceVehicles(): Observable<Vehicle[]> {
    console.log('Fetching all service vehicles...');
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vs`); // Assuming this endpoint
  }
}
