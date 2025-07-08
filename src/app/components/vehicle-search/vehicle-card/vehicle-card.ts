import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vehicle-card',
  imports: [],
  templateUrl: './vehicle-card.html',
  styleUrl: './vehicle-card.css'
})
export class VehicleCard {
  @Input() vehicle: any;
  @Output() favoriteToggled = new EventEmitter<void>();

  toggleFavorite() {
    this.favoriteToggled.emit();
  }
}
