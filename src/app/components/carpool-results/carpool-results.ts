import { Component, OnInit } from '@angular/core';
import { CarpoolService } from '../../services/carpool.service';

@Component({
  selector: 'app-carpool-results',
  templateUrl: './carpool-results.html',
  styleUrls: ['./carpool-results.css']
})
export class CarpoolResultsComponent implements OnInit {
  results: any[] = [];

  constructor(private carpoolService: CarpoolService) {}

  ngOnInit(): void {
    this.carpoolService.getCarpools().subscribe(data => {
      this.results = data;
    });
  }
}
