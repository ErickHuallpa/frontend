// src/services/cronograma.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Actividad, ActividadBase, getIdString } from '../models/actividad.model';
import { environment } from '../environment/environment';

interface ApiResponse {
  success: boolean;
  message: string;
  data: Actividad[];
}

@Injectable({
  providedIn: 'root'
})
export class CronogramaService {
  private apiUrl = `${environment.host}cronograma`;

  constructor(private http: HttpClient) { }

  getActividades(): Observable<Actividad[]> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map(response => this.normalizeActividades(response.data))
    );
  }

  getActividadesPorCandidato(candidatoId: string): Observable<Actividad[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}?candidatoId=${candidatoId}`).pipe(
      map(response => this.normalizeActividades(response.data))
    );
  }

  createActividad(actividad: ActividadBase): Observable<Actividad> {
    if (!actividad.candidatoId) {
      throw new Error('Se requiere un candidatoId para crear una actividad');
    }
    return this.http.post<{data: Actividad}>(this.apiUrl, actividad).pipe(
      map(response => response.data)
    );
  }

  updateActividad(id: string, actividad: ActividadBase): Observable<Actividad> {
    return this.http.patch<{data: Actividad}>(`${this.apiUrl}/${id}`, actividad).pipe(
      map(response => response.data)
    );
  }

  deleteActividad(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private normalizeActividades(actividades: Actividad[]): Actividad[] {
    return actividades.map(actividad => this.normalizeActividad(actividad));
  }

  private normalizeActividad(actividad: Actividad): Actividad {
    if (actividad._id && typeof actividad._id === 'object') {
      return {
        ...actividad,
        _id: getIdString(actividad._id)
      };
    }
    return actividad;
  }
}