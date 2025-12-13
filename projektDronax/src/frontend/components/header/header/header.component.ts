import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../authorization/service/auth.service';
import { ShoppingCartService } from '../../../services/ShoppingCart/shopping-cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  cartItems: any[] = [];
  showCart: boolean = false;
  totalPrice: number = 0;
  userName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit() {
    if (this.isAuthenticated()) {
      this.loadCartItems();
      this.userName = this.authService.getUserName();
    }

    this.shoppingCartService.getCartUpdateListener().subscribe(() => {
      this.loadCartItems();
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  handleAuth() {
    if (this.isAuthenticated()) {
      this.authService.logout();
      this.cartItems = [];
      this.totalPrice = 0;
      this.showCart = false;
      this.userName = '';
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadCartItems() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.shoppingCartService.getCartItems(userId).subscribe(items => {
        this.cartItems = items || [];
        this.calculateTotalPrice();
      });
    }
  }

  toggleCart() {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.showCart = !this.showCart;
    if (this.showCart) {
      this.loadCartItems();
    }
  }

  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
  }

  deleteItem(idDrone: number) {
    const userId = this.authService.getUserId();
    if (!confirm("Are you sure you want to delete this item from the cart?")) {
      return;
    }

    this.shoppingCartService.deleteCartItem(userId, idDrone).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.idDrone !== idDrone);
      this.calculateTotalPrice();
    });
  }
}
