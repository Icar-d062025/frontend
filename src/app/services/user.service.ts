import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    console.log('Fetching all users...');
    return this.http.get<User[]>(this.apiUrl, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  getUser(id: number): Observable<User> {
    console.log(`Fetching user with id: ${id}`);
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  banUser(id: number, reason: string, duration: number): Observable<void> {
    console.log(`Banning user with id: ${id}`);
    return this.http.post<void>(`${this.apiUrl}/${id}/ban?raison=${reason}&duree=${duration}`, {});
  }

  unbanUser(id: number): Observable<void> {
    console.log(`Unbanning user with id: ${id}`);
    // Assuming an endpoint for unbanning exists
    return this.http.post<void>(`${this.apiUrl}/${id}/unban`, {});
  }
}
