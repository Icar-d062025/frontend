import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: string;
  userId: number; // Ajout du champ userId qui existe dans le token
  // ... autres champs si besoin
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();

  private userIdSubject = new BehaviorSubject<number | null>(null);
  userId$ = this.userIdSubject.asObservable();

  constructor() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      this.setAuth(token, username);
    } else {
      // Ensure subjects are initialized to null if no auth data is found
      this.usernameSubject.next(null);
      this.roleSubject.next(null);
      this.userIdSubject.next(null);
    }
  }

  setAuth(token: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    this.usernameSubject.next(username);
    try {
      const decoded = jwtDecode(token) as JwtPayload & { authorities?: string[] };

      // Récupérer l'ID utilisateur depuis le champ 'userId' (pas 'sub')
      const userId = decoded.userId || null;
      this.userIdSubject.next(userId);
      console.log('DEBUG USER ID:', userId); // Debug pour vérifier

      console.log('authorities:', decoded.authorities); // DEBUG
      let role = null;
      if (decoded && Array.isArray(decoded.authorities)) {
        console.log('DEBUG authorities array:', decoded.authorities); // DEBUG
        if (decoded.authorities.includes('ROLE_ADMIN')) {
          role = 'admin';
        } else if (decoded.authorities.length > 0) {
          const authority = decoded.authorities[0];
          console.log('DEBUG ROLE authority:', authority); // DEBUG
          if (typeof authority === 'string' && authority.startsWith('ROLE_')) {
            role = authority.substring(5).toLowerCase();
          } else if (typeof authority === 'string') {
            role = authority.toLowerCase();
          } else {
            console.log('DEBUG authority not string:', authority); // DEBUG
            role = null;
          }
        } else {
          console.log('DEBUG authorities array empty'); // DEBUG
          role = null;
        }
      } else {
        console.log('DEBUG authorities not array or missing:', decoded ? decoded.authorities : undefined); // DEBUG
        role = null;
      }
      console.log('DEBUG ROLE final:', role); // DEBUG
      if (role) {
        localStorage.setItem('role', role);
        this.roleSubject.next(role);
      } else {
        localStorage.removeItem('role');
        this.roleSubject.next(null);
      }
    } catch {
      localStorage.removeItem('role');
      this.roleSubject.next(null);
    }
  }

  setUsername(username: string | null) {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
    this.usernameSubject.next(username);
  }

  getUsername(): string | null {
    return this.usernameSubject.value;
  }

  getRole(): string | null {
    return this.roleSubject.value;
  }

  getUserId(): number | null {
    return this.userIdSubject.value;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.usernameSubject.next(null);
    this.roleSubject.next(null);
    this.userIdSubject.next(null);
  }
}
