import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private apiUrl = 'http://localhost:8081/api/shoppingCart';
  private cartUpdated = new Subject<void>(); 

  constructor(private http: HttpClient) {}

  addToCart(idUser: number, idDrone: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/addItem`, { idUser, idDrone, quantity }).pipe(
      tap(() => {
        this.cartUpdated.next(); // Emit update
      })
    );
  }

  getCartItems(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getItems/${userId}`);
  }

  deleteCartItem(idUser: number, idDrone: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/removeItem/${idUser}/${idDrone}`).pipe(
      tap(() => {
        this.cartUpdated.next(); // Emit update
      })
    );
  }

  getCartUpdateListener() {
    return this.cartUpdated.asObservable();
  }
}
