import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DronesService {
  private apiUrl = 'http://localhost:8081/api/drones';

  private dronesSubject = new BehaviorSubject<any[]>([]);
  drones$ = this.dronesSubject.asObservable();

  private droneDetailsSubject = new BehaviorSubject<any | null>(null);
  droneDetails$ = this.droneDetailsSubject.asObservable();

  private droneImagesSubject = new BehaviorSubject<string[]>([]);
  droneImages$ = this.droneImagesSubject.asObservable();

  constructor(private http: HttpClient) { }

  addDrone(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, formData);
  }

  getDrone(idOrName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${idOrName}`);
  }

  editDrone(droneId: number, formData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/edit/${droneId}`, formData);
  }

  deleteDrone(droneId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${droneId}`);
  }

  getAllDrones(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll`);
  }

  refreshDrones() {
    this.getAllDrones().subscribe(drones => {
      this.dronesSubject.next(drones);
    });
  }

  refreshDroneDetails(id: string) {
    this.getDrone(id).subscribe(drone => {
      this.droneDetailsSubject.next(drone);
      this.droneImagesSubject.next(drone.pictures || []);
    });
  }

  getDiscountedDrones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getDiscounted`);
  }
  
  getTopDiscountedDrones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getDiscounted?limit=3`);
  }
  

/*   refreshDiscountedDrones() {
    this.getDiscountedDrones().subscribe(drones => {
      if (drones && Array.isArray(drones)) {
        this.dronesSubject.next(drones);
      } else {
        this.dronesSubject.next([]);
      }
    });
  } */
  
  
}
