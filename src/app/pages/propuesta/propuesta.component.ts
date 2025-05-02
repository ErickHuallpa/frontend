import { Component, OnInit } from '@angular/core';
import { PropuestaService } from '../../services/propuesta.service';
import { CandidatoService } from '../../services/candidato.service';
import { Candidato } from '../../models/candidato.model';
import { CreatePropuestaDto, Propuesta } from '../../models/propuesta.model';
import { getIdString } from '../../models/propuesta.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-propuesta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './propuesta.component.html',
  styleUrls: ['./propuesta.component.css']
})
export class PropuestaComponent implements OnInit {
  candidatos: Candidato[] = [];
  propuestas: Propuesta[] = [];
  isLoading = false;
  isLoadingCandidatos = false;
  errorMessage = '';
  candidatoSeleccionado: string | null = null;
  formPropuesta: Partial<Propuesta> = {};
  modalVisible = false;
  propuestaSeleccionada: Propuesta | null = null;
  propuestaAEliminar: Propuesta | null = null;
  
  getIdString = getIdString;

  constructor(
    private propuestaService: PropuestaService,
    private candidatoService: CandidatoService
  ) { }

  ngOnInit(): void {
    this.loadCandidatos();
  }

  abrirModal(propuesta?: Propuesta): void {
    this.propuestaSeleccionada = propuesta || null;
    this.formPropuesta = {
      titulo: propuesta?.titulo || '',
      descripcion: propuesta?.descripcion || '',
      candidatoId: this.candidatoSeleccionado!
    };
    this.modalVisible = true;
  }
  cerrarModal(): void {
    this.modalVisible = false;
    this.formPropuesta = {};
    this.propuestaSeleccionada = null;
  }
  guardarPropuesta(): void {
    if (!this.formPropuesta.titulo || !this.formPropuesta.descripcion) return;

    if (this.propuestaSeleccionada) {
      this.propuestaService.updatePropuesta(getIdString(this.propuestaSeleccionada._id), this.formPropuesta as CreatePropuestaDto).subscribe({
        next: () => {
          this.loadPropuestas(this.candidatoSeleccionado!);
          this.cerrarModal();
        },
        error: err => console.error('Error al actualizar', err)
      });
    } else {
      this.propuestaService.createPropuesta(this.formPropuesta as CreatePropuestaDto).subscribe({
        next: () => {
          this.loadPropuestas(this.candidatoSeleccionado!);
          this.cerrarModal();
        },
        error: err => console.error('Error al crear', err)
      });
    }
  }
  confirmarEliminar(propuesta: Propuesta): void {
    this.propuestaAEliminar = propuesta;
  }
  cancelarEliminar(): void {
    this.propuestaAEliminar = null;
  }
  eliminarConfirmado(): void {
    if (!this.propuestaAEliminar) return;
  
    const id = getIdString(this.propuestaAEliminar._id);
    this.propuestaService.deletePropuesta(id).subscribe({
      next: () => {
        this.loadPropuestas(this.candidatoSeleccionado!);
        this.cancelarEliminar();
      },
      error: err => {
        console.error('Error al eliminar', err);
        this.cancelarEliminar();
      }
    });
  }

  loadCandidatos(): void {
    this.isLoadingCandidatos = true;
    this.candidatoService.getCandidatos().subscribe({
      next: (data) => {
        this.candidatos = data;
        this.isLoadingCandidatos = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los candidatos';
        this.isLoadingCandidatos = false;
        console.error('Error:', error);
      }
    });
  }

  loadPropuestas(candidatoId: string): void {
    this.isLoading = true;
    this.candidatoSeleccionado = candidatoId;
    this.propuestaService.getPropuestasPorCandidato(candidatoId).subscribe({
      next: (data) => {
        this.propuestas = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las propuestas';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  getNombreCandidato(candidatoId: string): string {
    const candidato = this.candidatos.find(c => getIdString(c._id) === candidatoId);
    return candidato?.nombre || 'Candidato desconocido';
  }
}