import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = { username: '', password: '', repeatPassword: '', name: '', role: 'customer' };
  passwordMismatch = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  validatePasswords() {
    this.passwordMismatch = this.user.password !== this.user.repeatPassword;
  }

  register(form: NgForm) {
    if (form.invalid || this.passwordMismatch) {
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        alert("Registration was successfull!");
        this.router.navigate(['/login']);
      },
      error: () => this.errorMessage = 'Error during registration'
    });
  }
}
