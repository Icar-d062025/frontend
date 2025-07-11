import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth implements OnInit {
  private apiUrl = environment.apiUrl;
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

  // Validation pour les données de login
  validateLoginData(): boolean {
    if (!this.loginData.username || this.loginData.username.trim() === '') {
      this.errorMsg = 'Le nom d\'utilisateur est requis';
      return false;
    }
    if (!this.loginData.password || this.loginData.password.trim() === '') {
      this.errorMsg = 'Le mot de passe est requis';
      return false;
    }
    return true;
  }

  // Validation pour les données d'inscription
  validateRegisterData(): boolean {
    if (!this.registerData.email || this.registerData.email.trim() === '') {
      this.errorMsg = 'L\'email est requis';
      return false;
    }
    if (!this.registerData.nom || this.registerData.nom.trim() === '') {
      this.errorMsg = 'Le nom est requis';
      return false;
    }
    if (!this.registerData.prenom || this.registerData.prenom.trim() === '') {
      this.errorMsg = 'Le prénom est requis';
      return false;
    }
    if (!this.registerData.username || this.registerData.username.trim() === '') {
      this.errorMsg = 'Le nom d\'utilisateur est requis';
      return false;
    }
    if (!this.registerData.password || this.registerData.password.trim() === '') {
      this.errorMsg = 'Le mot de passe est requis';
      return false;
    }
    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.errorMsg = 'Format d\'email invalide';
      return false;
    }
    return true;
  }

  login() {
    this.errorMsg = '';
    this.successMsg = '';

    // Valider les données avant d'envoyer
    if (!this.validateLoginData()) {
      return;
    }

    this.loading = true;

    // Nettoyer les données avant envoi
    const cleanLoginData = {
      username: this.loginData.username.trim(),
      password: this.loginData.password.trim()
    };

    this.http.post(`${this.apiUrl}/auth/login`, cleanLoginData, { responseType: 'text' }).subscribe({
      next: (res) => {
        if (res.startsWith('ey')) { // crude JWT check
          this.successMsg = 'Login successful!';
          localStorage.setItem('token', res);
          this.authService.setUsername(cleanLoginData.username);
          this.router.navigate(['/']);
        } else {
          this.errorMsg = res;
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'An error occurred during login';
      }
    });
  }

  register() {
    this.errorMsg = '';
    this.successMsg = '';

    // Valider les données avant d'envoyer
    if (!this.validateRegisterData()) {
      return;
    }

    this.loading = true;

    // Nettoyer les données avant envoi
    const cleanRegisterData = {
      email: this.registerData.email.trim(),
      nom: this.registerData.nom.trim(),
      prenom: this.registerData.prenom.trim(),
      username: this.registerData.username.trim(),
      password: this.registerData.password.trim()
    };

    this.http.post(`${this.apiUrl}/auth/register`, cleanRegisterData, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = res;
        this.isLogin = true; // Switch to login form after successful registration
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'An error occurred during registration';
      }
    });
  }

  ngOnInit() {
    // Rediriger si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
}
