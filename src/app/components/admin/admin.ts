import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VsListComponent } from './vs-list/vs-list.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, UserListComponent, VehicleListComponent, VsListComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  activeTab: string = 'users';

  ngOnInit() {
    console.log('Admin component initialized');
  }

  selectTab(tab: string) {
    console.log(`Selecting tab: ${tab}`);
    this.activeTab = tab;
  }
}
