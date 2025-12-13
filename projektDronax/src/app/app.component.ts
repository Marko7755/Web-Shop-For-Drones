import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../frontend/components/header/header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'projektDronax';
  
  constructor(private router: Router) {}

  isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

}
