import { Component, OnInit } from '@angular/core';
import { Persona } from '../../models/persona.model';
import { PersonaService } from '../../services/persona.service';
import { Candidato, getIdString} from '../../models/candidato.model';
import { CandidatoService } from '../../services/candidato.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VotoService } from '../../services/voto.service';
import { CreateVotoDto, getIdVotoString} from '../../models/voto.model';
import { PartidoPoliticoService } from '../../services/partido-politico.service';
import { PartidoPolitico } from '../../models/partido-politico.model';

@Component({
  selector: 'app-voto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './voto.component.html',
})
export class VotoComponent implements OnInit {
  mensajeExito: string = '';
  cedula: string = '';
  persona: Persona | null = null;
  error: string = '';
  mostrarModalExito: boolean = false;
  candidatosPresidente: Candidato[] = [];
  candidatosGobernador: Candidato[] = [];
  partidos: PartidoPolitico[] = [];
  candidatoPresidenteSeleccionado: Candidato | null = null;
  candidatoGobernadorSeleccionado: Candidato | null = null;

  getIdString = getIdString;

  constructor(
    private personaService: PersonaService,
    private candidatoService: CandidatoService,
    private votoService: VotoService,
    private partidoService : PartidoPoliticoService
  ) {}

  ngOnInit() {
    this.candidatoService.getCandidatos().subscribe(candidatos => {
      this.candidatosPresidente = candidatos.filter(c => c.cargo === 'Presidente');
      this.candidatosGobernador = candidatos.filter(c => c.cargo === 'Gobernador');
    });
    this.partidoService.getPartidosPoliticos().subscribe(partidos => {
      this.partidos = partidos;
    })
  }

  validarCedula() {
    this.error = '';
    this.persona = null;

    if (!this.cedula.trim()) {
      this.error = 'Debe ingresar una cédula.';
      return;
    }

    this.personaService.getPersonaByCedula(this.cedula).subscribe({
      next: (data) => {
        this.persona = data;
      },
      error: () => {
        this.error = 'Persona no encontrada o error en la búsqueda.';
      },
    });
  }

  seleccionarCandidatoPresidente(candidato: Candidato, event: any) {
    if (event.target.checked) {
      this.candidatoPresidenteSeleccionado = candidato;
    } else {
      this.candidatoPresidenteSeleccionado = null;
    }
  }

  seleccionarCandidatoGobernador(candidato: Candidato, event: any) {
    if (event.target.checked) {
      this.candidatoGobernadorSeleccionado = candidato;
    } else {
      this.candidatoGobernadorSeleccionado = null;
    }
  }

  isCandidatoPresidenteSeleccionado(candidato: Candidato): boolean {
    return this.candidatoPresidenteSeleccionado?.nombre === candidato.nombre;
  }

  isCandidatoGobernadorSeleccionado(candidato: Candidato): boolean {
    return this.candidatoGobernadorSeleccionado?.nombre === candidato.nombre;
  }

  enviarVoto() {
    if (!this.persona || !this.candidatoPresidenteSeleccionado || !this.candidatoGobernadorSeleccionado) {
      this.error = 'Debe seleccionar un candidato para cada cargo.';
      return;
    }
  
    const voto: CreateVotoDto = {
      cedulaIdentidad: this.persona.cedulaIdentidad,
      presidenteViceId: getIdVotoString(this.candidatoPresidenteSeleccionado._id),
      gobernadorId: getIdVotoString(this.candidatoGobernadorSeleccionado._id)
    };
  
    this.votoService.votar(voto).subscribe({
      next: () => {
        this.mostrarModalExito = true;
        this.candidatoPresidenteSeleccionado = null;
        this.candidatoGobernadorSeleccionado = null;
        this.cedula = '';
      },
      error: (err) => {
        if (err.status === 400 && err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Error al registrar el voto.';
        }
      }
    });
  }
  cerrarModal() {
    this.mostrarModalExito = false;
    window.location.reload();
  }    

  getSiglasDelPartido(partidoPoliticoId: string): string {
    const partido = this.partidos.find(p => p._id === partidoPoliticoId);
    return partido ? partido.siglas : 'Sin Partido';
  }

  getPartidoLogo(partidoId: string): string {
    const partido = this.partidos.find(p => this.getIdString(p._id) === partidoId);
    return partido?.logoUrl || 'https://cdn-icons-png.flaticon.com/512/5172/5172186.png';
  }
}
