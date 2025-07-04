import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getUsers(): Observable<User[]> {
    console.log('Fetching all users...');
    return this.http.get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getUser(id: number): Observable<User> {
    console.log(`Fetching user with id: ${id}`);
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  banUser(id: number, reason: string, duration: number): Observable<void> {
    console.log(`Banning user with id: ${id} - Admin token included`);

    // Convertir la durée en jours vers un format LocalTime
    // Par exemple: 7 jours = 7 heures pour le stockage (ou autre logique selon votre besoin)
    // Ou on peut envoyer directement les jours et laisser le backend convertir
    const durationTime = this.convertDaysToLocalTime(duration);

    return this.http.post<void>(
      `${this.apiUrl}/${id}/ban?raison=${reason}&duree=${durationTime}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  unbanUser(id: number): Observable<void> {
    console.log(`Unbanning user with id: ${id} - Admin token included`);
    return this.http.post<void>(
      `${this.apiUrl}/${id}/unban`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  updateUserName(id: number, firstName: string, lastName: string): Observable<User> {
    console.log(`Updating user ${id} name - Admin token included`);

    // D'abord récupérer l'utilisateur existant pour garder l'email
    return this.getUser(id).pipe(
      switchMap(existingUser => {
        const updateData = {
          email: existingUser.email,  // Garder l'email existant
          prenom: firstName,
          nom: lastName,
          role: existingUser.role,    // Garder le rôle existant
          username: existingUser.username // Garder le username existant
        };
        return this.http.put<User>(
          `${this.apiUrl}/${id}`,
          updateData,
          { headers: this.getAuthHeaders() }
        );
      })
    );
  }

  updateUserRole(id: number, role: string): Observable<User> {
    console.log(`Updating user ${id} role to ${role} - Admin token included`);

    // D'abord récupérer l'utilisateur existant pour garder l'email
    return this.getUser(id).pipe(
      switchMap(existingUser => {
        const updateData = {
          email: existingUser.email,     // Garder l'email existant
          prenom: existingUser.prenom,   // Garder le prénom existant (corrigé)
          nom: existingUser.nom,         // Garder le nom existant (corrigé)
          role: role,                    // Nouveau rôle
          username: existingUser.username // Garder le username existant
        };
        return this.http.put<User>(
          `${this.apiUrl}/${id}`,
          updateData,
          { headers: this.getAuthHeaders() }
        );
      })
    );
  }

  // Méthode pour que l'utilisateur mette à jour son propre profil
  updateCurrentUserProfile(profileData: Partial<User>): Observable<User> {
    console.log('Updating current user profile - User token included');

    return this.http.put<User>(
      `${this.apiUrl}/profile`, // Endpoint spécifique pour le profil utilisateur
      profileData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Méthode pour récupérer le profil de l'utilisateur connecté
  getCurrentUserProfile(): Observable<User> {
    console.log('Fetching current user profile');
    return this.http.get<User>(
      `${this.apiUrl}/profile`,
      { headers: this.getAuthHeaders() }
    );
  }

  private convertDaysToLocalTime(days: number): string {
    // Option 1: Convertir jours en heures (7 jours = 168 heures)
    // return `${days * 24}:00:00`;

    // Option 2: Utiliser les jours comme heures (plus simple pour l'affichage)
    // 7 jours = 07:00:00
    const hours = days.toString().padStart(2, '0');
    return `${hours}:00:00`;

    // Option 3: Si le backend attend un format différent, ajuster ici
  }
}
