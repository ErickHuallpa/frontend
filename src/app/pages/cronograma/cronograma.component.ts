import { Component, OnInit } from '@angular/core';
import { CronogramaService } from '../../services/cronograma.service';
import { Actividad, ActividadBase, getIdString } from '../../models/actividad.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidatoService } from '../../services/candidato.service';
import { Candidato } from '../../models/candidato.model';

@Component({
  selector: 'app-cronograma',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css']
})
export class CronogramaComponent implements OnInit {
  candidatos: Candidato[] = [];
  actividades: Actividad[] = [];
  actividadesFiltradas: Actividad[] = [];
  isLoading = false;
  isLoadingCandidatos = false;
  errorMessage = '';
  candidatoSeleccionado: string | null = null;
  
  showEditModal = false;
  showDeleteModal = false;
  isNewActividad = false;
  selectedActividad: Actividad | null = null;
  actividadEditada: ActividadBase = {
    titulo: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    estado: 'pendiente',
    candidatoId: ''
  };

  estados = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_progreso', label: 'En progreso' },
    { value: 'completado', label: 'Completado' }
  ];

  getIdString = getIdString;

  constructor(
    private cronogramaService: CronogramaService,
    private candidatoService: CandidatoService
  ) { }

  ngOnInit(): void {
    this.loadCandidatos();
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://cdn-icons-png.flaticon.com/512/5172/5172186.png';
  }

  getEstadoLabel(estado: string): string {
    const estadoObj = this.estados.find(e => e.value === estado);
    return estadoObj ? estadoObj.label : estado;
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

  loadActividades(candidatoId: string): void {
    this.isLoading = true;
    this.candidatoSeleccionado = candidatoId;
    this.cronogramaService.getActividadesPorCandidato(candidatoId).subscribe({
      next: (data) => {
        this.actividades = data;
        this.actividadesFiltradas = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las actividades';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  filtrarPorEstado(estado: string): void {
    if (estado === 'todos') {
      this.actividadesFiltradas = [...this.actividades];
    } else {
      this.actividadesFiltradas = this.actividades.filter(a => a.estado === estado);
    }
  }

  openAddModal(): void {
    this.isNewActividad = true;
    this.actividadEditada = {
      titulo: '',
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      estado: 'pendiente',
      candidatoId: this.candidatoSeleccionado || ''
    };
    this.showEditModal = true;
  }

  openEditModal(actividad: Actividad): void {
    this.isNewActividad = false;
    this.selectedActividad = actividad;
    this.actividadEditada = { 
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      fecha: actividad.fecha.toString().split('T')[0],
      estado: actividad.estado,
      candidatoId: actividad.candidatoId
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedActividad = null;
    this.isNewActividad = false;
  }

  openDeleteModal(actividad: Actividad): void {
    this.selectedActividad = actividad;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
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
    if (!this.actividadEditada.candidatoId && this.candidatoSeleccionado) {
      this.actividadEditada.candidatoId = this.candidatoSeleccionado;
    }
    
    this.cronogramaService.createActividad(this.actividadEditada)
      .subscribe({
        next: (newActividad) => {
          this.actividades.push(newActividad);
          this.filtrarPorEstado('todos');
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error al crear:', error);
          this.errorMessage = error.error?.message || 'Error al crear la actividad';
        }
      });
  }

  actualizarActividad(): void {
    if (!this.selectedActividad) return;
    
    const actividadId = getIdString(this.selectedActividad._id);
    this.cronogramaService.updateActividad(actividadId, this.actividadEditada)
      .subscribe({
        next: (updatedActividad) => {
          const index = this.actividades.findIndex(a => getIdString(a._id) === getIdString(updatedActividad._id));
          if (index !== -1) {
            this.actividades[index] = updatedActividad;
            this.filtrarPorEstado('todos');
          }
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          this.errorMessage = error.error?.message || 'Error al actualizar la actividad';
        }
      });
  }

  eliminarActividad(): void {
    if (!this.selectedActividad) return;
    
    const actividadId = getIdString(this.selectedActividad._id);
    this.cronogramaService.deleteActividad(actividadId)
      .subscribe({
        next: () => {
          this.actividades = this.actividades.filter(a => getIdString(a._id) !== actividadId);
          this.actividadesFiltradas = this.actividadesFiltradas.filter(a => getIdString(a._id) !== actividadId);
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          this.errorMessage = error.error?.message || 'Error al eliminar la actividad';
        }
      });
  }

  getNombreCandidato(candidatoId: string): string {
    const candidato = this.candidatos.find(c => getIdString(c._id) === candidatoId);
    return candidato?.nombre || 'Candidato desconocido';
  }
}