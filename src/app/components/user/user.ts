import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class UserComponent implements OnInit {
  user: User | null = null;
  loading = false;
  saving = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Form data
  userForm = {
    prenom: '',
    nom: '',
    email: '',
    username: '',
    adresse: '',
    vehiculePerso: false,
    vehiculeId: undefined as number | undefined // Changé de null vers undefined
  };

  // Available vehicles for selection
  availableVehicles: any[] = [];

  constructor(
    private userService: UserService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadAvailableVehicles();
  }

  loadUserProfile() {
    this.loading = true;
    this.error = null;

    this.userService.getCurrentUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.populateForm(user);
        this.loading = false;
        console.log('User profile loaded:', user);
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement du profil';
        this.loading = false;
        console.error('Error loading user profile:', error);
      }
    });
  }

  loadAvailableVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.availableVehicles = vehicles;
        console.log('Available vehicles loaded:', vehicles);
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
      }
    });
  }

  populateForm(user: User) {
    this.userForm = {
      prenom: user.prenom || '',
      nom: user.nom || '',
      email: user.email || '',
      username: user.username || '',
      adresse: user.adresse || '',
      vehiculePerso: user.vehiculePerso || false,
      vehiculeId: user.vehiculeId || undefined // Changé de null vers undefined
    };
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.saving = true;
    this.error = null;
    this.successMessage = null;

    const profileData = {
      prenom: this.userForm.prenom.trim(),
      nom: this.userForm.nom.trim(),
      email: this.userForm.email.trim(),
      adresse: this.userForm.adresse.trim(),
      vehiculePerso: this.userForm.vehiculePerso,
      vehiculeId: this.userForm.vehiculePerso ? this.userForm.vehiculeId : undefined // Changé de null vers undefined
    };

    this.userService.updateCurrentUserProfile(profileData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.saving = false;
        this.successMessage = 'Profil mis à jour avec succès !';
        console.log('Profile updated successfully:', updatedUser);

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        this.saving = false;
        this.error = 'Erreur lors de la mise à jour du profil';
        console.error('Error updating profile:', error);
      }
    });
  }

  validateForm(): boolean {
    if (!this.userForm.prenom.trim()) {
      this.error = 'Le prénom est requis';
      return false;
    }
    if (!this.userForm.nom.trim()) {
      this.error = 'Le nom est requis';
      return false;
    }
    if (!this.userForm.email.trim()) {
      this.error = 'L\'email est requis';
      return false;
    }
    if (!this.isValidEmail(this.userForm.email)) {
      this.error = 'L\'email n\'est pas valide';
      return false;
    }
    if (this.userForm.vehiculePerso && !this.userForm.vehiculeId) {
      this.error = 'Veuillez sélectionner un véhicule';
      return false;
    }
    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onVehiculePersoChange() {
    if (!this.userForm.vehiculePerso) {
      this.userForm.vehiculeId = undefined; // Changé de null vers undefined
    }
  }

  dismissError() {
    this.error = null;
  }

  dismissSuccess() {
    this.successMessage = null;
  }

  getInitials(): string {
    if (!this.user) return 'U';
    const firstInitial = this.user.prenom?.charAt(0)?.toUpperCase() || '';
    const lastInitial = this.user.nom?.charAt(0)?.toUpperCase() || '';
    return firstInitial + lastInitial || this.user.username?.charAt(0)?.toUpperCase() || 'U';
  }
}
