import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = ''; 
  password: string = ''; 
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);

        // Provjeri postoji li spremljena ruta i preusmjeri korisnika
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin'); // Obriši spremljenu rutu
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => this.errorMessage = 'Invalid username or password'
    });
  }
}
