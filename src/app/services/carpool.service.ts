import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarpoolService {
  private apiUrl = 'http://localhost:8080/api/carpools';

  constructor(private http: HttpClient) {}

  getCarpools(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}