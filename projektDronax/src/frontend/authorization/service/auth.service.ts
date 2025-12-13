import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('token');
    if (!token) return false;
  
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin';
  }

  getUserId(): number {
    const token = localStorage.getItem('token');
    if (!token) return 0;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      return payload.userId || 0;
    } catch (error) {
      console.error("Error decoding token:", error);
      return 0;
    }
  }
  
  getUserName(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      return payload.username || '';
    } catch (error) {
      console.error("Error decoding token:", error);
      return '';
    }
  }
  
  
}