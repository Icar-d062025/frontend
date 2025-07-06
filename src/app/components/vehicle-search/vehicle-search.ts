import { Component, signal } from '@angular/core';
import { VehicleCard } from './vehicle-card/vehicle-card';

@Component({
  selector: 'app-vehicle-search',
  imports: [ VehicleCard ],
  templateUrl: './vehicle-search.html',
  styleUrl: './vehicle-search.css'
})
export class VehicleSearch {
  vehicles = signal([
    {
      name: 'AUDI - S e-tron GT',
      seats: 5,
      co2: 99,
      immat: 'AA 666 ZZ',
      img: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Audi_S5_Sportback_Blue_IAA_2013.JPG',
      favorite: true
    },
    {
      name: 'VOLKSWAGEN - Coccinelle',
      seats: 5,
      co2: 159,
      immat: 'CC 123 CC',
      img: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/VW_K%C3%A4fer_1300_-_Flickr_-_mick_-_Lumix.jpg',
      favorite: false
    }
  ]);

  toggleFavorite(index: number) {
    const updated = [...this.vehicles()];
    updated[index].favorite = !updated[index].favorite;
    this.vehicles.set(updated);
  }
}
