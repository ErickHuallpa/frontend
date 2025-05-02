// src/app/pages/candidato/candidato.component.ts
import { Component, OnInit } from '@angular/core';
import { CandidatoService } from '../../services/candidato.service';
import { Candidato, CandidatoBase, getIdString } from '../../models/candidato.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartidoPolitico } from '../../models/partido-politico.model';
import { PartidoPoliticoService } from '../../services/partido-politico.service';

@Component({
  selector: 'app-candidato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidato.component.html',
  styleUrls: ['./candidato.component.css']
})
export class CandidatoComponent implements OnInit {
  candidatos: Candidato[] = [];
  partidos: PartidoPolitico[] = [];
  isLoading = true;
  isLoadingPartidos = true;
  errorMessage = '';
  
  showEditModal = false;
  showDeleteModal = false;
  isNewCandidato = false;
  selectedCandidato: Candidato | null = null;
  candidatoEditado: CandidatoBase = {
    nombre: '',
    edad: 0,
    cargo: '',
    partidoId: '',
    votos: 0,
    foto: ''
  };
  getIdString = getIdString;

  constructor(
    private candidatoService: CandidatoService,
    private partidoService: PartidoPoliticoService
  ) { }

  ngOnInit(): void {
    this.loadCandidatos();
    this.loadPartidos();
  }

  getPresidentes(): Candidato[] {
    return this.candidatos.filter(c => c.cargo === 'Presidente');
  }

  getGobernadores(): Candidato[] {
    return this.candidatos.filter(c => c.cargo === 'Gobernador');
  }

  getPresidentesOrdenados(): Candidato[] {
    const presidentes = this.getPresidentes();
    return presidentes.sort((a, b) => {
      const partidoA = this.partidos.find(p => this.getIdString(p._id) === this.getIdString(a.partidoId));
      const partidoB = this.partidos.find(p => this.getIdString(p._id) === this.getIdString(b.partidoId));
      return partidoA?.nombre.localeCompare(partidoB?.nombre || '') || 0;
    });
  }

  getGobernadoresOrdenados(): Candidato[] {
    const gobernadores = this.getGobernadores();
    return gobernadores.sort((a, b) => {
      const partidoA = this.partidos.find(p => this.getIdString(p._id) === this.getIdString(a.partidoId));
      const partidoB = this.partidos.find(p => this.getIdString(p._id) === this.getIdString(b.partidoId));
      return partidoA?.nombre.localeCompare(partidoB?.nombre || '') || 0;
    });
  }

  getPartidoSiglas(partidoId: string): string {
    const partido = this.partidos.find(p => this.getIdString(p._id) === partidoId);
    return partido ? partido.siglas : 'N/A';
  }

  getPartidoLogo(partidoId: string): string {
    const partido = this.partidos.find(p => this.getIdString(p._id) === partidoId);
    return partido?.logoUrl || 'https://cdn-icons-png.flaticon.com/512/5172/5172186.png';
  }

  loadCandidatos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.candidatoService.getCandidatos().subscribe({
      next: (data) => {
        this.candidatos = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los candidatos';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  loadPartidos(): void {
    this.isLoadingPartidos = true;
    this.partidoService.getPartidosPoliticos().subscribe({
      next: (data) => {
        this.partidos = data;
        this.isLoadingPartidos = false;
      },
      error: (error) => {
        console.error('Error al cargar partidos:', error);
        this.isLoadingPartidos = false;
      }
    });
  }

  openAddModal(): void {
    this.isNewCandidato = true;
    this.candidatoEditado = {
      nombre: '',
      edad: 0,
      cargo: '',
      partidoId: '',
      votos: 0,
      foto: ''
    };
    this.showEditModal = true;
  }

  openEditModal(candidato: Candidato): void {
    this.isNewCandidato = false;
    this.selectedCandidato = candidato;
    this.candidatoEditado = { 
      nombre: candidato.nombre,
      edad: candidato.edad,
      cargo: candidato.cargo,
      partidoId: candidato.partidoId,
      votos: candidato.votos || 0,
      foto: candidato.foto || ''
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedCandidato = null;
    this.isNewCandidato = false;
  }

  openDeleteModal(candidato: Candidato): void {
    this.selectedCandidato = candidato;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedCandidato = null;
  }

  guardarCandidato(): void {
    if (this.isNewCandidato) {
      this.crearCandidato();
    } else {
      this.actualizarCandidato();
    }
  }

  crearCandidato(): void {
    const candidatoData = {
      nombre: this.candidatoEditado.nombre,
      edad: this.candidatoEditado.edad,
      cargo: this.candidatoEditado.cargo,
      partidoId: this.candidatoEditado.partidoId,
      votos: 0,
      foto: this.candidatoEditado.foto || ''
    };

    this.candidatoService.createCandidato(candidatoData)
      .subscribe({
        next: (newCandidato) => {
          this.candidatos.push(newCandidato);
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error al crear:', error);
          this.errorMessage = error.error?.message || 'Error al crear el candidato';
        }
      });
  }

  actualizarCandidato(): void {
    if (!this.selectedCandidato) return;
    
    const candidatoId = this.getIdString(this.selectedCandidato._id);
    const candidatoData = {
      nombre: this.candidatoEditado.nombre,
      edad: this.candidatoEditado.edad,
      cargo: this.candidatoEditado.cargo,
      partidoId: this.candidatoEditado.partidoId,
      foto: this.candidatoEditado.foto || ''
    };

    this.candidatoService.updateCandidato(candidatoId, candidatoData)
      .subscribe({
        next: (updatedCandidato) => {
          const updatedId = getIdString(updatedCandidato._id);
          const index = this.candidatos.findIndex(c => getIdString(c._id) === updatedId);
          
          if (index !== -1) {
            this.candidatos[index] = updatedCandidato;
          }
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          this.errorMessage = error.error?.message || 'Error al actualizar el candidato';
        }
      });
  }

  eliminarCandidato(): void {
    if (!this.selectedCandidato) return;
    
    const candidatoId = this.getIdString(this.selectedCandidato._id);
    this.candidatoService.deleteCandidato(candidatoId)
      .subscribe({
        next: () => {
          this.candidatos = this.candidatos.filter(c => getIdString(c._id) !== candidatoId);
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          this.errorMessage = error.error?.message || 'Error al eliminar el candidato';
        }
      });
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://cdn-icons-png.flaticon.com/512/5172/5172186.png';
    this.candidatoEditado.foto = '';
  }
}