import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Candidato, CandidatoBase, getIdString } from '../models/candidato.model';
import { PartidoPolitico } from '../models/partido-politico.model';
import { environment } from '../environment/environment';

interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  private apiUrl = `${environment.host}candidatos`;
  private partidosUrl = `${environment.host}partido-politico`;

  constructor(private http: HttpClient) { }

  getCandidatos(): Observable<Candidato[]> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map(response => this.normalizeCandidatos(response.data))
    );
  }

  getPartidosPoliticos(): Observable<PartidoPolitico[]> {
    return this.http.get<ApiResponse>(this.partidosUrl).pipe(
      map(response => response.data)
    );
  }

  getCandidato(id: string): Observable<Candidato> {
    return this.http.get<{data: Candidato}>(`${this.apiUrl}/${id}`).pipe(
      map(response => this.normalizeCandidato(response.data))
    );
  }

  createCandidato(candidato: CandidatoBase): Observable<Candidato> {
    return this.http.post<{data: Candidato}>(this.apiUrl, candidato).pipe(
      map(response => response.data)
    );
  }

  updateCandidato(id: string, candidato: CandidatoBase): Observable<Candidato> {
    const candidatoSinId = {...candidato};
    return this.http.put<{data: Candidato}>(`${this.apiUrl}/${id}`, candidatoSinId).pipe(
      map(response => response.data)
    );
  }

  deleteCandidato(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private normalizeCandidatos(candidatos: Candidato[]): Candidato[] {
    return candidatos.map(candidato => this.normalizeCandidato(candidato));
  }

  private normalizeCandidato(candidato: Candidato): Candidato {
    if (candidato._id && typeof candidato._id === 'object') {
      return {
        ...candidato,
        _id: getIdString(candidato._id)
      };
    }
    return candidato;
  }
}