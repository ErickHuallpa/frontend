import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  PartidoPolitico, 
  PartidoPoliticoBase, 
  MongoDBObjectId,
  getIdString
} from '../models/partido-politico.model';
import { environment } from '../environment/environment';

interface ApiResponse {
  success: boolean;
  message: string;
  data: PartidoPolitico[];
}

@Injectable({
  providedIn: 'root'
})
export class PartidoPoliticoService {
  private apiUrl = `${environment.host}partido-politico`;

  constructor(private http: HttpClient) { }

  getPartidosPoliticos(): Observable<PartidoPolitico[]> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map(response => this.normalizePartidos(response.data))
    );
  }

  getPartidoPolitico(id: string): Observable<PartidoPolitico> {
    return this.http.get<{data: PartidoPolitico}>(`${this.apiUrl}/${id}`).pipe(
      map(response => this.normalizePartido(response.data))
    );
  }

  createPartidoPolitico(partido: PartidoPoliticoBase): Observable<PartidoPolitico> {
    return this.http.post<{data: PartidoPolitico}>(this.apiUrl, partido).pipe(
      map(response => response.data)
    );
  }

  updatePartidoPolitico(id: string, partido: PartidoPoliticoBase): Observable<PartidoPolitico> {
    const { _id, ...partidoSinId } = partido as any;
    return this.http.put<{data: PartidoPolitico}>(`${this.apiUrl}/${id}`, partidoSinId).pipe(
      map(response => response.data)
    );
  }

  deletePartidoPolitico(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private normalizePartidos(partidos: PartidoPolitico[]): PartidoPolitico[] {
    return partidos.map(partido => this.normalizePartido(partido));
  }

  private normalizePartido(partido: PartidoPolitico): PartidoPolitico {
    if (partido._id && typeof partido._id === 'object') {
      return {
        ...partido,
        _id: getIdString(partido._id)
      };
    }
    return partido;
  }

  searchPartidosPoliticos(term: string): Observable<PartidoPolitico[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/search`, {
      params: { term }
    }).pipe(
      map(response => this.normalizePartidos(response.data)),
      catchError(error => {
        console.error('Error en búsqueda:', error);
        throw error;
      })
    );
  }
}