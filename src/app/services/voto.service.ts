import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateVotoDto } from '../models/voto.model';

@Injectable({
  providedIn: 'root',
})
export class VotoService {
  private baseUrl = 'http://localhost:3000/votos';

  constructor(private http: HttpClient) {}

  votar(dto: CreateVotoDto): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }
}
