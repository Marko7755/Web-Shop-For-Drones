import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DronesService } from '../../services/DronesService/drones.service';
import { RouterModule } from '@angular/router';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../authorization/service/auth.service';
import { ShoppingCartService } from '../../services/ShoppingCart/shopping-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drone-details',
  standalone: true,
  imports: [RouterModule, DateFormatPipe, CommonModule],
  templateUrl: './drone-details.component.html',
  styleUrl: './drone-details.component.css'
})
export class DroneDetailsComponent implements OnInit {
  drone: any = {};
  currentSlide: number = 0;
  new: any;
  id: string | null = null;
  quantity: number = 1;
  private routeSub!: Subscription;

  constructor(private route: ActivatedRoute, private dronesService: DronesService, private authService: AuthService, 
    private router: Router, private shoppingCartService : ShoppingCartService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.dronesService.droneDetails$.subscribe(drone => {
        if (drone) {
          this.drone = drone;
        }
      });

      this.dronesService.refreshDroneDetails(this.id); // Inicijalno dohvaćanje podataka

      this.routeSub = this.route.paramMap.subscribe(params => {
        this.loadDroneDetails(params.get('id'));
      });
    }
  }

  loadDroneDetails(id: string | null) {
    if (id) {
      this.dronesService.refreshDroneDetails(id);
      this.dronesService.droneDetails$.subscribe(drone => {
        if (drone) {
          this.drone = drone;
        }
      });
    }
  }

  nextSlide() {
    if (this.drone.pictures && this.drone.pictures.length > 1) {
      this.currentSlide = (this.currentSlide + 1) % this.drone.pictures.length;
    }
  }

  prevSlide() {
    if (this.drone.pictures && this.drone.pictures.length > 1) {
      this.currentSlide = (this.currentSlide - 1 + this.drone.pictures.length) % this.drone.pictures.length;
    }
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.authService.isAuthenticated()) {
      localStorage.setItem('redirectAfterLogin', this.router.url);
      this.router.navigate(['/login']);
      return;
    }

    const userId = this.authService.getUserId();
    const droneId = this.drone.idDrone;

    this.shoppingCartService.addToCart(userId, droneId, this.quantity).subscribe(response => {
      console.log(response.message);
      alert(`Drone ${this.drone.name} successfully added to Shopping Cart!`)
    });
  }
  
  ngOnDestroy() {
    this.routeSub.unsubscribe(); // Unsubscribe when component is destroyed
  }
  
}
