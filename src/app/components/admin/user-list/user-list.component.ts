import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  // Pour le modal de bannissement
  showBanModal = false;
  selectedUser: User | null = null;
  banReason = '';
  banDuration = 7;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        console.log('Users loaded:', users);
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  openBanModal(user: User) {
    this.selectedUser = user;
    this.banReason = '';
    this.banDuration = 7;
    this.showBanModal = true;
  }

  closeBanModal() {
    this.showBanModal = false;
    this.selectedUser = null;
    this.banReason = '';
    this.banDuration = 7;
  }

  banUser() {
    if (!this.selectedUser || !this.banReason.trim()) {
      return;
    }

    this.userService.banUser(this.selectedUser.id, this.banReason, this.banDuration).subscribe({
      next: () => {
        console.log('User banned successfully');
        this.loadUsers(); // Recharger la liste
        this.closeBanModal();
      },
      error: (error) => {
        console.error('Error banning user:', error);
        this.error = 'Erreur lors du bannissement de l\'utilisateur';
      }
    });
  }

  unbanUser(user: User) {
    if (confirm(`Êtes-vous sûr de vouloir débannir ${user.username} ?`)) {
      this.userService.unbanUser(user.id).subscribe({
        next: () => {
          console.log('User unbanned successfully');
          this.loadUsers(); // Recharger la liste
        },
        error: (error) => {
          console.error('Error unbanning user:', error);
          this.error = 'Erreur lors du débannissement de l\'utilisateur';
        }
      });
    }
  }

  getUserRoleBadgeClass(role: string = 'user'): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'badge-error';
      case 'moderator':
        return 'badge-warning';
      default:
        return 'badge-neutral';
    }
  }

  dismissError() {
    this.error = null;
  }
}
