import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Candidato } from '../../models/candidato.model';
import { CandidatoService } from '../../services/candidato.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PartidoPolitico } from '../../models/partido-politico.model';
import { PartidoPoliticoService } from '../../services/partido-politico.service';
import { io } from 'socket.io-client';

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

  private socket!: any;

  constructor(
    private candidatoService: CandidatoService,
    private partidoPoliticoService : PartidoPoliticoService,
    @Inject(PLATFORM_ID) private platformId: Object,
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
    });

    if(isPlatformBrowser(this.platformId)){
      this.socket = io('http://localhost:3000');
      this.socket.on('candidatoActualizado', (c: Candidato) => this.actualizarCandidato(c));
    }
  }

  actualizarCandidato(candidato: Candidato){
    const lista = candidato.cargo === 'Presidente' ? this.presidentes : this.gobernadores;
    const index = lista.findIndex(c => c._id === candidato._id);
    
    if (index !== -1) {
      lista[index] = candidato;
      lista.sort((a, b) => (b.votos || 0) - (a.votos || 0));
    }
  }
  
  calcularPorcentaje(votos: number = 0, lista: Candidato[]): number {
    const max = Math.max(...lista.map(c => c.votos || 0));
    return max > 0 ? (votos / max) * 100 : 0;
  }
  
}
