import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eleccion, CreateEleccionDto, UpdateEleccionDto } from '../models/eleccion.model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EleccionService {
  private apiUrl = `${environment.host}elecciones`;

  constructor(private http: HttpClient) {}

  createEleccion(eleccion: CreateEleccionDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, eleccion);
  }

  getAllElecciones(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getEleccionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateEleccion(id: string, eleccion: UpdateEleccionDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, eleccion);
  }

  deleteEleccion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}