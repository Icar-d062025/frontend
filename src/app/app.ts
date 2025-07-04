import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy {
  protected title = 'Icar';
  private roleSub: Subscription | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.roleSub = this.authService.role$.subscribe(role => {
      const username = this.authService.getUsername();
      const token = localStorage.getItem('token');
      let decoded = null;
      try {
        if (token) {
          decoded = jwtDecode(token);
        }
      } catch {}
      console.log('DEBUG AUTH:', { role, username, token, decoded });
    });
  }

  ngOnDestroy() {
    this.roleSub?.unsubscribe();
  }
}
