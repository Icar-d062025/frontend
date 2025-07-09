import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Subscription} from 'rxjs';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy {
  username: string | null = null;
  role: string | null = null;
  private sub: Subscription | undefined;
  private subRole: Subscription | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.sub = this.authService.username$.subscribe(username => {
      this.username = username;
    });
    this.subRole = this.authService.role$.subscribe(role => {
      this.role = role;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.subRole?.unsubscribe();
  }

  goToAuth() {
    this.router.navigate(['/auth']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  goToVehicules() {
    this.router.navigate(['/vehicules']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getInitials(): string {
    if (!this.username) return 'U';
    const words = this.username.split(' ');
    if (words.length >= 2) {
      return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    }
    return this.username.charAt(0).toUpperCase();
  }
}
