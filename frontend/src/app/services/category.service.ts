import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories'

  constructor(private http: HttpClient) { }

  public getByUser(userId: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`)
  }

  public create(category: {name: string; color: string; userId: number}):Observable<any>{
    return this.http.post<any>(this.apiUrl, category)
  }
}
