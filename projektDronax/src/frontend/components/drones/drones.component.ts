import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DronesService } from '../../services/DronesService/drones.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-drones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './drones.component.html',
  styleUrl: './drones.component.css'
})
export class DronesComponent implements OnInit {
  drones: any[] = [];

  constructor(private dronesService: DronesService) {}

  ngOnInit() {
    this.dronesService.drones$.subscribe(drones => {
        this.drones = drones.map(drone => ({
            ...drone,
            hasDiscount: drone.discounts.length > 0 // Check if drone has active discounts
        }));
    });

    this.dronesService.refreshDrones();
}

}
