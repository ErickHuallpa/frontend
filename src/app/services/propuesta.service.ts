import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Propuesta, getIdString, CreatePropuestaDto} from '../models/propuesta.model';
import { environment } from '../environment/environment';

interface ApiResponse {
  success: boolean;
  message: string;
  data: Propuesta[];
}

@Injectable({
  providedIn: 'root'
})
export class PropuestaService {
  private apiUrl = `${environment.host}propuestas`;

  constructor(private http: HttpClient) { }

  getPropuestasPorCandidato(candidatoId: string): Observable<Propuesta[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}?candidatoId=${candidatoId}`).pipe(
      map(response => this.normalizePropuestas(response.data))
    );
  }

  createPropuesta(propuesta: CreatePropuestaDto): Observable<Propuesta> {
    return this.http.post<{data: Propuesta}>(this.apiUrl, propuesta).pipe(
      map(response => response.data)
    );
  }

  private normalizePropuestas(propuestas: Propuesta[]): Propuesta[] {
    return propuestas.map(propuesta => this.normalizePropuesta(propuesta));
  }

  private normalizePropuesta(propuesta: Propuesta): Propuesta {
    if (propuesta._id && typeof propuesta._id === 'object') {
      return {
        ...propuesta,
        _id: getIdString(propuesta._id)
      };
    }
    return propuesta;
  }
  updatePropuesta(id: string, propuesta: CreatePropuestaDto): Observable<Propuesta> {
    return this.http.put<{ data: Propuesta }>(`${this.apiUrl}/${id}`, propuesta).pipe(
      map(res => res.data)
    );
  }
  
  deletePropuesta(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}