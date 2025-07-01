import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: string;
  // ... autres champs si besoin
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnInit {
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  username$ = this.usernameSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));
  role$ = this.roleSubject.asObservable();

  setAuth(token: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    this.usernameSubject.next(username);
    try {
      const decoded = jwtDecode(token) as JwtPayload & { authorities?: string[] };
      console.log('authorities:', decoded.authorities); // DEBUG
      let role = null;
      // Correction stricte : extrait le rôle depuis authorities (et log pour debug)
      if (decoded && Array.isArray(decoded.authorities) && decoded.authorities.length > 0) {
        const authority = decoded.authorities[0];
        console.log('DEBUG ROLE authority:', authority); // DEBUG
        if (typeof authority === 'string' && authority.startsWith('ROLE_')) {
          role = authority.substring(5).toLowerCase(); // retire 'ROLE_' et met en minuscule
        } else {
          role = authority.toLowerCase();
        }
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.usernameSubject.next(null);
    this.roleSubject.next(null);
  }

  ngOnInit() {
    console.log('Role actuel:', this.getRole());
  }
}
