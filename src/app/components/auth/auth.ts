import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  isLogin = true;
  loading = false;
  errorMsg = '';
  successMsg = '';

  loginData = { username: '', password: '' };
  registerData = { email: '', nom: '', prenom: '', username: '', password: '' };

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.errorMsg = '';
    this.successMsg = '';
  }

  login() {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';
    this.http.post('http://localhost:8080/api/auth/login', this.loginData, { responseType: 'text' }).subscribe({
      next: (res) => {
        if (res.startsWith('ey')) { // crude JWT check
          this.successMsg = 'Login successful!';
          localStorage.setItem('token', res);
          this.authService.setUsername(this.loginData.username);
          this.router.navigate(['/']);
        } else {
          this.errorMsg = res;
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Login failed';
        this.loading = false;
      }
    });
  }

  register() {
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';
    this.http.post('http://localhost:8080/api/auth/register', this.registerData, { responseType: 'text' }).subscribe({
      next: (res) => {
        if (res === 'Registration successful') {
          this.successMsg = res;
          this.authService.setUsername(this.registerData.username);
          this.router.navigate(['/']);
        } else {
          this.errorMsg = res;
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Registration failed';
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    // Redirige si déjà connecté
    if (localStorage.getItem('token') || localStorage.getItem('username')) {
      this.router.navigate(['/']);
    }
  }
}
