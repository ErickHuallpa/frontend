import { Component, OnInit } from '@angular/core';
import { Eleccion, CreateEleccionDto, UpdateEleccionDto, getIdString, EleccionId } from '../../models/eleccion.model';
import { EleccionService } from '../../services/eleccion.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dia-eleccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dia-eleccion.component.html',
  styleUrls: ['./dia-eleccion.component.css']
})
export class DiaEleccionComponent implements OnInit {
  elecciones: Eleccion[] = [];
  eleccionForm: FormGroup;
  isEditMode = false;
  currentEleccionId: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  isModalOpen: boolean = false;

  isDeleteModalOpen = false;
  eleccionIdToDelete: string = '';

  getIdString = getIdString;

  constructor(
    private eleccionService: EleccionService,
    private fb: FormBuilder
  ) {
    this.eleccionForm = this.fb.group({
      fechaInicio: ['', Validators.required],
      horaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadElecciones();
  }

  loadElecciones(): void {
    this.eleccionService.getAllElecciones().subscribe(
      (response) => {
        if (response.success) {
          this.elecciones = response.data;
          this.isLoading = false;
        } else {
          this.errorMessage = 'Error al cargar las elecciones';
          this.isLoading = false;
        }
      },
      (error) => {
        this.errorMessage = 'Error al conectar con el servidor';
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.eleccionForm.invalid) return;

    const eleccionData: CreateEleccionDto = this.eleccionForm.value;

    if (this.isEditMode && this.currentEleccionId) {
      this.eleccionService.updateEleccion(this.currentEleccionId, eleccionData).subscribe(
        (response) => {
          if (response.success) {
            this.loadElecciones();
            this.resetForm();
            this.closeModal();
          } else {
            this.errorMessage = 'Error al actualizar la elección';
          }
        },
        (error) => {
          this.errorMessage = 'Error al conectar con el servidor';
        }
      );
    } else {
      this.eleccionService.createEleccion(eleccionData).subscribe(
        (response) => {
          if (response.success) {
            this.loadElecciones();
            this.resetForm();
            this.closeModal();
          } else {
            this.errorMessage = 'Error al crear la elección';
          }
        },
        (error) => {
          this.errorMessage = 'Error al conectar con el servidor';
        }
      );
    }
  }

  openEditModal(eleccion: Eleccion): void {
    this.isEditMode = true;
    this.currentEleccionId = getIdString(eleccion._id);
    
    this.eleccionForm.patchValue({
      fechaInicio: this.formatDateForInput(eleccion.fechaInicio),
      horaInicio: eleccion.horaInicio,
      fechaFin: this.formatDateForInput(eleccion.fechaFin)
    });
    
    this.isModalOpen = true;
  }

  openCreateModal(): void {
    this.resetForm();
    this.isModalOpen = true;
    this.isEditMode = false;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  deleteEleccion(id: EleccionId): void {
    if (confirm('¿Estás seguro de eliminar esta elección?')) {
      this.eleccionService.deleteEleccion(getIdString(id)).subscribe(
        (response) => {
          if (response.success) {
            this.loadElecciones();
          } else {
            this.errorMessage = 'Error al eliminar la elección';
          }
        },
        (error) => {
          this.errorMessage = 'Error al conectar con el servidor';
        }
      );
    }
  }

  resetForm(): void {
    this.eleccionForm.reset();
    this.isEditMode = false;
    this.currentEleccionId = '';
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  openDeleteModal(id: string): void {
    this.eleccionIdToDelete = id;
    this.isDeleteModalOpen = true;
  }
  
  confirmDelete(): void {
    this.eleccionService.deleteEleccion(this.eleccionIdToDelete).subscribe(
      (response) => {
        if (response.success) {
          this.loadElecciones();
          this.closeDeleteModal();
        } else {
          this.errorMessage = 'Error al eliminar la elección';
        }
      },
      (error) => {
        this.errorMessage = 'Error al conectar con el servidor';
      }
    );
  }
  
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.eleccionIdToDelete = '';
  }
  
}