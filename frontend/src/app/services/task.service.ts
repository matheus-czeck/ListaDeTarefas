import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/task';

  constructor(private http: HttpClient) {}

  public getByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }

  public create(task: any): Observable<any[]> {
    return this.http.post<any>(this.apiUrl, task);
  }
  public update(id: number, taskData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateTask/${id}`, taskData);
  }

  public delete(id: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`)
  }
}
