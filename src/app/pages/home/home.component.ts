import { Component, OnInit } from '@angular/core';
import { Candidato } from '../../models/candidato.model';
import { CandidatoService } from '../../services/candidato.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PartidoPolitico } from '../../models/partido-politico.model';
import { PartidoPoliticoService } from '../../services/partido-politico.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  presidentes: Candidato[] = [];
  gobernadores: Candidato[] = [];
  partidosPoliticos: PartidoPolitico[] = [];

  constructor(
    private candidatoService: CandidatoService,
    private partidoPoliticoService : PartidoPoliticoService
  ) {}

  ngOnInit(): void {
    this.candidatoService.getCandidatos().subscribe(candidatos => {
      this.presidentes = candidatos
        .filter(c => c.cargo.toLowerCase() === 'presidente')
        .sort((a, b) => (b.votos || 0) - (a.votos || 0));

      this.gobernadores = candidatos
        .filter(c => c.cargo.toLowerCase() === 'gobernador')
        .sort((a, b) => (b.votos || 0) - (a.votos || 0));
    });
    this.partidoPoliticoService.getPartidosPoliticos().subscribe(partidos => {
      this.partidosPoliticos = partidos;
    })
  }
  calcularPorcentaje(votos: number = 0, lista: Candidato[]): number {
    const max = Math.max(...lista.map(c => c.votos || 0));
    return max > 0 ? (votos / max) * 100 : 0;
  }
  
}
