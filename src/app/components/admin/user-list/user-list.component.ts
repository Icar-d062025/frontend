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

  // Pour l'édition en ligne
  editingUser: { [key: number]: { field: string, value: string } } = {};

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
    const displayName = this.getUserDisplayName(user);
    if (confirm(`Êtes-vous sûr de vouloir débannir ${displayName} ?`)) {
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

  updateUserRole(user: User, role: string) {
    if (!role || (role !== 'USER' && role !== 'ADMIN')) {
      this.error = 'Le rôle doit être "USER" ou "ADMIN"';
      return;
    }

    this.userService.updateUserRole(user.id, role).subscribe({
      next: (updatedUser) => {
        console.log('User role updated successfully');
        // Mettre à jour l'utilisateur dans la liste
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], role: updatedUser.role };
        }
        this.stopEditing(user.id);
      },
      error: (error) => {
        console.error('Error updating user role:', error);
        this.error = 'Erreur lors de la mise à jour du rôle';
        this.stopEditing(user.id);
      }
    });
  }

  dismissError() {
    this.error = null;
  }

  getUserRoleBadgeClass(role: string = 'USER'): string {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'badge-error';
      case 'MODERATOR':
        return 'badge-warning';
      default:
        return 'badge-neutral';
    }
  }

  updateUserName(user: User, firstName: string, lastName: string) {
    if (!firstName.trim() && !lastName.trim()) {
      this.error = 'Le prénom et le nom ne peuvent pas être vides';
      return;
    }

    this.userService.updateUserName(user.id, firstName.trim(), lastName.trim()).subscribe({
      next: (updatedUser) => {
        console.log('User name updated successfully');
        // Mettre à jour l'utilisateur dans la liste
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], prenom: updatedUser.prenom, nom: updatedUser.nom };
        }
        this.stopEditing(user.id);
      },
      error: (error) => {
        console.error('Error updating user name:', error);
        this.error = 'Erreur lors de la mise à jour du nom';
        this.stopEditing(user.id);
      }
    });
  }

  startEditing(userId: number, field: string, currentValue: string) {
    this.editingUser[userId] = { field, value: currentValue };
  }

  stopEditing(userId: number) {
    delete this.editingUser[userId];
  }

  isEditing(userId: number, field: string): boolean {
    return this.editingUser[userId]?.field === field;
  }

  onEditSubmit(user: User, field: string) {
    const editData = this.editingUser[user.id];
    if (!editData || editData.field !== field) return;

    if (field === 'fullName') {
      // Séparer le nom complet en prénom et nom
      const names = editData.value.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';
      this.updateUserName(user, firstName, lastName);
    } else if (field === 'role') {
      this.updateUserRole(user, editData.value);
    }
  }

  onEditCancel(userId: number) {
    this.stopEditing(userId);
  }

  getFullName(user: User): string {
    return `${user.prenom || ''} ${user.nom || ''}`.trim() || 'N/A';
  }

  getUserInitial(user: User): string {
    // Priorité : prenom > nom > email > 'U'
    if (user.prenom) {
      return user.prenom.charAt(0).toUpperCase();
    }
    if (user.nom) {
      return user.nom.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  }

  getUserDisplayName(user: User): string {
    // Priorité : nom complet > email > ID
    const fullName = this.getFullName(user);
    if (fullName !== 'N/A') {
      return fullName;
    }
    if (user.email) {
      return user.email;
    }
    return `Utilisateur #${user.id}`;
  }
}
