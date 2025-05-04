import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../models/persona.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private apiUrl = 'http://localhost:3000/persona';

  constructor(private http: HttpClient) {}

  getPersonaByCedula(cedula: string): Observable<Persona> {
    return this.http.get<{ success: boolean; message: string; data: Persona }>(
      `${this.apiUrl}/cedula/${cedula}`
    ).pipe(map(response => response.data));
  }
}
