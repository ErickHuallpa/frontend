// src/app/pages/candidato/candidato.component.ts
import { Component, OnInit } from '@angular/core';
import { CandidatoService } from '../../services/candidato.service';
import { Candidato, CandidatoBase, CandidatoId, getIdString } from '../../models/candidato.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartidoPolitico } from '../../models/partido-politico.model';
import { PartidoPoliticoService } from '../../services/partido-politico.service';
import { AuthService } from '../../services/auth.service';
import { CreatePropuestaDto, Propuesta } from '../../models/propuesta.model';
import { PropuestaService } from '../../services/propuesta.service';
import { Actividad } from '../../models/actividad.model';
import { CronogramaService } from '../../services/cronograma.service';

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
  usuarioLogueado: boolean = false;
  
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

  showPropuestasModal = false;
  showPropuestaEditModal = false;
  showDeletePropuestaModal = false;
  isLoadingPropuestas = false;
  propuestas: Propuesta[] = [];
  isNewPropuesta = false;
  selectedPropuesta: Propuesta | null = null;
  propuestaEditada: CreatePropuestaDto = {
    titulo: '',
    descripcion: '',
    candidatoId: ''
  };

  showActividadesModal = false;
  showActividadEditModal = false;
  showDeleteActividadModal = false;
  isLoadingActividades = false;
  actividades: Actividad[] = [];
  isNewActividad = false;
  selectedActividad: Actividad | null = null;
  actividadEditada: any = {
    titulo: '',
    descripcion: '',
    fecha: new Date().toISOString().slice(0, 16),
    estado: 'pendiente',
    candidatoId: ''
  };

  constructor(
    private candidatoService: CandidatoService,
    private partidoService: PartidoPoliticoService,
    private authService: AuthService,
    private propuestaService: PropuestaService,
    private cronogramaService: CronogramaService,
  ) { }

  ngOnInit(): void {
    this.loadCandidatos();
    this.loadPartidos();
    this.usuarioLogueado = this.authService.isLoggedIn();
  }

  verPropuestas(candidato: Candidato): void {
    this.selectedCandidato = candidato;
    this.loadPropuestas(candidato._id);
    this.showPropuestasModal = true;
  }
  
  loadPropuestas(candidatoId: CandidatoId): void {
    this.isLoadingPropuestas = true;
    const idString = getIdString(candidatoId);
    
    this.propuestaService.getPropuestasPorCandidato(idString).subscribe({
      next: (propuestas) => {
        this.propuestas = propuestas;
        this.isLoadingPropuestas = false;
      },
      error: (error) => {
        console.error('Error al cargar propuestas:', error);
        this.isLoadingPropuestas = false;
        this.errorMessage = 'Error al cargar las propuestas';
      }
    });
  }
  
  closePropuestasModal(): void {
    this.showPropuestasModal = false;
    this.selectedCandidato = null;
    this.propuestas = [];
  }
  
  openAddPropuestaModal(): void {
    if (!this.selectedCandidato) return;
    
    this.isNewPropuesta = true;
    this.propuestaEditada = {
      titulo: '',
      descripcion: '',
      candidatoId: getIdString(this.selectedCandidato._id)
    };
    this.showPropuestaEditModal = true;
  }
  
  openEditPropuestaModal(propuesta: Propuesta): void {
    this.isNewPropuesta = false;
    this.selectedPropuesta = propuesta;
    this.propuestaEditada = {
      titulo: propuesta.titulo,
      descripcion: propuesta.descripcion,
      candidatoId: propuesta.candidatoId
    };
    this.showPropuestaEditModal = true;
  }
  
  closePropuestaEditModal(): void {
    this.showPropuestaEditModal = false;
    this.selectedPropuesta = null;
  }
  
  openDeletePropuestaModal(propuesta: Propuesta): void {
    this.selectedPropuesta = propuesta;
    this.showDeletePropuestaModal = true;
  }
  
  closeDeletePropuestaModal(): void {
    this.showDeletePropuestaModal = false;
    this.selectedPropuesta = null;
  }
  
  guardarPropuesta(): void {
    if (this.isNewPropuesta) {
      this.crearPropuesta();
    } else {
      this.actualizarPropuesta();
    }
  }
  
  crearPropuesta(): void {
    if (!this.selectedCandidato) return;
    
    this.propuestaService.createPropuesta(this.propuestaEditada).subscribe({
      next: (nuevaPropuesta) => {
        this.propuestas.push(nuevaPropuesta);
        this.closePropuestaEditModal();
      },
      error: (error) => {
        console.error('Error al crear propuesta:', error);
        this.errorMessage = 'Error al crear la propuesta';
      }
    });
  }
  
  actualizarPropuesta(): void {
    if (!this.selectedPropuesta) return;
    
    const propuestaId = getIdString(this.selectedPropuesta._id);
    this.propuestaService.updatePropuesta(propuestaId, this.propuestaEditada).subscribe({
      next: (propuestaActualizada) => {
        const index = this.propuestas.findIndex(p => getIdString(p._id) === propuestaId);
        if (index !== -1) {
          this.propuestas[index] = propuestaActualizada;
        }
        this.closePropuestaEditModal();
      },
      error: (error) => {
        console.error('Error al actualizar propuesta:', error);
        this.errorMessage = 'Error al actualizar la propuesta';
      }
    });
  }
  
  eliminarPropuesta(): void {
    if (!this.selectedPropuesta) return;
    
    const propuestaId = getIdString(this.selectedPropuesta._id);
    this.propuestaService.deletePropuesta(propuestaId).subscribe({
      next: () => {
        this.propuestas = this.propuestas.filter(p => getIdString(p._id) !== propuestaId);
        this.closeDeletePropuestaModal();
      },
      error: (error) => {
        console.error('Error al eliminar propuesta:', error);
        this.errorMessage = 'Error al eliminar la propuesta';
      }
    });
  }


  verActividades(candidato: Candidato): void {
    this.selectedCandidato = candidato;
    this.loadActividades(candidato._id);
    this.showActividadesModal = true;
  }
  
  loadActividades(candidatoId: CandidatoId): void {
    this.isLoadingActividades = true;
    const idString = getIdString(candidatoId);
    
    this.cronogramaService.getActividadesPorCandidato(idString).subscribe({
      next: (actividades) => {
        this.actividades = actividades.sort((a, b) => {
          const dateA = new Date(a.fecha).getTime();
          const dateB = new Date(b.fecha).getTime();
          return dateA - dateB;
        });
        this.isLoadingActividades = false;
      },
      error: (error) => {
        console.error('Error al cargar actividades:', error);
        this.isLoadingActividades = false;
        this.errorMessage = 'Error al cargar las actividades';
      }
    });
  }
  
  closeActividadesModal(): void {
    this.showActividadesModal = false;
    this.selectedCandidato = null;
    this.actividades = [];
  }
  
  openAddActividadModal(): void {
    if (!this.selectedCandidato) return;
    
    this.isNewActividad = true;
    this.actividadEditada = {
      titulo: '',
      descripcion: '',
      fecha: new Date().toISOString().slice(0, 16),
      estado: 'pendiente',
      candidatoId: getIdString(this.selectedCandidato._id)
    };
    this.showActividadEditModal = true;
  }
  
  openEditActividadModal(actividad: Actividad): void {
    this.isNewActividad = false;
    this.selectedActividad = actividad;
    this.actividadEditada = {
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      fecha: new Date(actividad.fecha).toISOString().slice(0, 16),
      estado: actividad.estado,
      candidatoId: actividad.candidatoId
    };
    this.showActividadEditModal = true;
  }
  
  closeActividadEditModal(): void {
    this.showActividadEditModal = false;
    this.selectedActividad = null;
  }
  
  openDeleteActividadModal(actividad: Actividad): void {
    this.selectedActividad = actividad;
    this.showDeleteActividadModal = true;
  }
  
  closeDeleteActividadModal(): void {
    this.showDeleteActividadModal = false;
    this.selectedActividad = null;
  }
  
  guardarActividad(): void {
    if (this.isNewActividad) {
      this.crearActividad();
    } else {
      this.actualizarActividad();
    }
  }
  
  crearActividad(): void {
    if (!this.selectedCandidato) return;
    
    const actividadData = {
      ...this.actividadEditada,
      fecha: new Date(this.actividadEditada.fecha).toISOString()
    };
  
    this.cronogramaService.createActividad(actividadData).subscribe({
      next: (nuevaActividad) => {
        this.actividades.push(nuevaActividad);
        this.actividades = this.actividades.sort((a, b) => {
          const dateA = new Date(a.fecha).getTime();
          const dateB = new Date(b.fecha).getTime();
          return dateA - dateB;
        });
        this.closeActividadEditModal();
      },
      error: (error) => {
        console.error('Error al crear actividad:', error);
        this.errorMessage = 'Error al crear la actividad';
      }
    });
  }
  
  actualizarActividad(): void {
    if (!this.selectedActividad) return;
    
    const actividadId = getIdString(this.selectedActividad._id);
    const actividadData = {
      ...this.actividadEditada,
      fecha: new Date(this.actividadEditada.fecha).toISOString()
    };
  
    this.cronogramaService.updateActividad(actividadId, actividadData).subscribe({
      next: (actividadActualizada) => {
        const index = this.actividades.findIndex(a => getIdString(a._id) === actividadId);
        if (index !== -1) {
          this.actividades[index] = actividadActualizada;
        }
        this.actividades = this.actividades.sort((a, b) => {
          const dateA = new Date(a.fecha).getTime();
          const dateB = new Date(b.fecha).getTime();
          return dateA - dateB;
        });
        this.closeActividadEditModal();
      },
      error: (error) => {
        console.error('Error al actualizar actividad:', error);
        this.errorMessage = 'Error al actualizar la actividad';
      }
    });
  }
  
  eliminarActividad(): void {
    if (!this.selectedActividad) return;
    
    const actividadId = getIdString(this.selectedActividad._id);
    this.cronogramaService.deleteActividad(actividadId).subscribe({
      next: () => {
        this.actividades = this.actividades.filter(a => getIdString(a._id) !== actividadId);
        this.closeDeleteActividadModal();
      },
      error: (error) => {
        console.error('Error al eliminar actividad:', error);
        this.errorMessage = 'Error al eliminar la actividad';
      }
    });
  }
  
  getEstadoTexto(estado: string): string {
    switch(estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_progreso': return 'En progreso';
      case 'completado': return 'Completado';
      default: return estado;
    }
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