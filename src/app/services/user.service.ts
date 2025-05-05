import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getIdString, User } from '../models/user.model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.host}users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateUser(user: Partial<User>): Observable<any> {
    const id = getIdString(user._id!);
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string | { $oid: string }): Observable<any> {
    const stringId = typeof id === 'string' ? id : id.$oid;
    return this.http.delete<any>(`${this.apiUrl}/${stringId}`);
  }
  updateUserWithId(id: string, user: Partial<User>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, user);
  }
  
}
