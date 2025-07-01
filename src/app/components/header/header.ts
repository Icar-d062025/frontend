import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy {
  username: string | null = null;
  private sub: Subscription | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.sub = this.authService.username$.subscribe(username => {
      this.username = username;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  goToAuth() {
    this.router.navigate(['/auth']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
