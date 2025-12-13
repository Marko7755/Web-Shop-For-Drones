import { Component, OnInit } from '@angular/core';
import { DronesService } from '../../../services/DronesService/drones.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit {
  topDiscountedDrones: any[] = [];

  constructor(private dronesService: DronesService) {}

  ngOnInit() {
    this.dronesService.getTopDiscountedDrones().subscribe(drones => {
      this.topDiscountedDrones = drones;
    });
  }
}
