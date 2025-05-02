import { Component, OnInit } from '@angular/core';
import { PartidoPoliticoService } from '../../services/partido-politico.service';
import { 
  PartidoPolitico, 
  PartidoPoliticoBase, 
  getIdString 
} from '../../models/partido-politico.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-partido-politico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partido-politico.component.html',
  styleUrls: ['./partido-politico.component.css']
})
export class PartidoPoliticoComponent implements OnInit {
  partidos: PartidoPolitico[] = [];
  isLoading = true;
  errorMessage = '';
  
  showEditModal = false;
  showDeleteModal = false;
  isNewPartido = false;
  selectedPartido: PartidoPolitico | null = null;

  searchTerm = '';
  searchResults: PartidoPolitico[] = [];
  isSearching = false;
  searchNotFound = false;


  partidoEditado: PartidoPoliticoBase = {
    nombre: '',
    descripcion: '',
    fundacion: new Date(),
    logoUrl: '',
    siglas: ''
  };

  constructor(private partidoService: PartidoPoliticoService) { }

  ngOnInit(): void {
    this.loadPartidosPoliticos();
  }

  searchPartidos(): void {
    if (!this.searchTerm.trim()) {
      this.clearSearch();
      return;
    }
  
    this.isSearching = true;
    this.searchNotFound = false;
    
    this.partidoService.searchPartidosPoliticos(this.searchTerm).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
        this.searchNotFound = results.length === 0;
      },
      error: (error) => {
        console.error('Error al buscar:', error);
        this.isSearching = false;
        this.errorMessage = 'Error al realizar la búsqueda';
        this.searchNotFound = true;
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.isSearching = false;
    this.searchNotFound = false;
  }

  loadPartidosPoliticos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.partidoService.getPartidosPoliticos().subscribe({
      next: (data) => {
        this.partidos = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los partidos políticos';
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  openAddModal(): void {
    this.isNewPartido = true;
    this.partidoEditado = {
      nombre: '',
      descripcion: '',
      fundacion: new Date(),
      logoUrl: '',
      siglas: ''
    };
    this.showEditModal = true;
  }

  openEditModal(partido: PartidoPolitico): void {
    this.isNewPartido = false;
    this.selectedPartido = partido;
    this.partidoEditado = { 
      nombre: partido.nombre,
      descripcion: partido.descripcion,
      fundacion: partido.fundacion,
      logoUrl: partido.logoUrl,
      siglas: partido.siglas
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedPartido = null;
    this.isNewPartido = false;
  }

  openDeleteModal(partido: PartidoPolitico): void {
    this.selectedPartido = partido;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedPartido = null;
  }

  guardarPartido(): void {
    if (this.isNewPartido) {
      this.crearPartido();
    } else {
      this.actualizarPartido();
    }
  }

  crearPartido(): void {
    const partidoParaCrear = {
      ...this.partidoEditado,
      fundacion: this.formatDate(this.partidoEditado.fundacion)
    };

    this.partidoService.createPartidoPolitico(partidoParaCrear)
      .subscribe({
        next: (newPartido) => {
          this.partidos.push(newPartido);
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error al crear:', error);
          this.errorMessage = error.error?.message || 'Error al crear el partido político';
        }
      });
  }

  actualizarPartido(): void {
    if (!this.selectedPartido) return;
    
    const partidoId = getIdString(this.selectedPartido._id);
        const partidoParaActualizar = {
      nombre: this.partidoEditado.nombre,
      descripcion: this.partidoEditado.descripcion,
      fundacion: this.formatDate(this.partidoEditado.fundacion),
      logoUrl: this.partidoEditado.logoUrl,
      siglas: this.partidoEditado.siglas
    };
  
    this.partidoService.updatePartidoPolitico(partidoId, partidoParaActualizar)
      .subscribe({
        next: (updatedPartido) => {
          const index = this.partidos.findIndex(p => getIdString(p._id) === partidoId);
          
          if (index !== -1) {
            this.partidos[index] = updatedPartido;
          }
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          this.errorMessage = error.error?.message || 'Error al actualizar el partido político';
        }
      });
  }

  eliminarPartido(): void {
    if (!this.selectedPartido) return;
    
    const partidoId = getIdString(this.selectedPartido._id);
    this.partidoService.deletePartidoPolitico(partidoId)
      .subscribe({
        next: () => {
          this.partidos = this.partidos.filter(p => getIdString(p._id) !== partidoId);
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          this.errorMessage = error.error?.message || 'Error al eliminar el partido político';
        }
      });
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date;
    }
    return date.toISOString().split('T')[0];
  }
}