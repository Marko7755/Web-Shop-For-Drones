import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Discount } from '../../classes/Discount/discount';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {
  private apiUrl = 'http://localhost:8081/api/discounts';

  private discountsSubject = new BehaviorSubject<Discount[]>([]);
  discounts$ = this.discountsSubject.asObservable();

  constructor(private http: HttpClient) { }

  refreshDiscounts() {
    this.getAllDiscounts().subscribe(discounts => {
      this.discountsSubject.next(discounts);
    });
  }

  addDiscount(discountToAdd: Discount): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, discountToAdd);
  }

  getDiscount(idDiscount: string): Observable<any> {
    return this.http.get<Discount>(`${this.apiUrl}/get/${idDiscount}`);
  }

  editDiscount(discountToEdit: Discount): Observable<any> {
    return this.http.patch(`${this.apiUrl}/edit`, discountToEdit);
  }

  deleteDiscount(discountId: Number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${discountId}`);
  }

  getAllDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(`${this.apiUrl}/getAll`);
  }

  applyDiscount(discountData: { idDrone: number; idDiscount: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply`, discountData);
  }
}
