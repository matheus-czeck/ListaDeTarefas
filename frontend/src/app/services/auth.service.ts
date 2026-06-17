import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) { }

  public register(data: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  public login(data:any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, data);
    
  }
}
