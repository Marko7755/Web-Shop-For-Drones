import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DronesService } from '../../../services/DronesService/drones.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-discounted-drones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './discounted-drones.component.html',
  styleUrl: './discounted-drones.component.css'
})
export class DiscountedDronesComponent implements OnInit {
  discountedDrones: any[] = [];

  constructor(private dronesService: DronesService) {}

  ngOnInit() {
    this.dronesService.getDiscountedDrones().subscribe(drones => {
      this.discountedDrones = drones;
    });
  }
  
  
}
