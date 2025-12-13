import { Injectable } from '@angular/core';
import { Manufacturer } from '../../classes/Manufacturer/manufacturer';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {
  private apiUrl = 'http://localhost:8081/api/manufacturers'; 

   // BehaviorSubject to hold manufacturers list
  private manufacturersSubject = new BehaviorSubject<Manufacturer[]>([]);
  manufacturer$ = this.manufacturersSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Fetch manufacturers and update the BehaviorSubject
  fetchManufacturers(): void {
    this.http.get<Manufacturer[]>(`${this.apiUrl}/getAll`).subscribe((manufacturers) => {
      this.manufacturersSubject.next(manufacturers);
    })
  }

  manufacturerAdd(manuToAdd : Manufacturer) : Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, manuToAdd).pipe(
      tap(() => {
        this.fetchManufacturers(); // Refresh the list after adding a new manufacturer
      })
    );
  }

  getManufacturers() : Observable<any> {
    return this.http.get<Manufacturer[]>(`${this.apiUrl}/getAll`);
  }

  getManufacturer(idOrName : string): Observable<any> {
    return this.http.get<Manufacturer>(`${this.apiUrl}/get`, { params: {idOrName} });
  }

  editManufacturer(manuToEdit : Manufacturer) : Observable<any> {
    return this.http.patch(`${this.apiUrl}/edit`, manuToEdit).pipe(
      tap(() => {
        this.fetchManufacturers();
      })
    );
  }

  deleteManufacturer(manuToDelete : Manufacturer) : Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${manuToDelete.idManufacturer}`).pipe(
      tap(() => {
        this.fetchManufacturers();
      })
    )
  }

}
