import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { getIdString, User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { PartidoPoliticoService } from '../../services/partido-politico.service';
import { PartidoPolitico } from '../../models/partido-politico.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  rolUsuario: string | null = null;
  partidoIdUsuario: string | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  isSuperAdmin: boolean = false;

  getIdString = getIdString;

  isEditModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;
  editUser: User = { _id: '', username: '', role: '', partidoId: '' };
  deleteUserId: string = '';

  partidos: PartidoPolitico[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private partidoPoliticoService: PartidoPoliticoService 
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadPartidos();
    this.rolUsuario = this.authService.getRole();
    this.partidoIdUsuario = this.authService.getPartidoId();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (response) => {
        if (response.success) {
          this.users = response.data;
          this.isLoading = false;
        } else {
          this.errorMessage = 'Error al cargar los usuarios';
          this.isLoading = false;
        }
      },
      (error) => {
        this.errorMessage = 'Error al conectar con el servidor';
        this.isLoading = false;
      }
    );
  }

  loadPartidos(): void {
    this.partidoPoliticoService.getPartidosPoliticos().subscribe(
      (partidos) => {
        this.partidos = partidos;
      },
      (error) => {
        this.errorMessage = 'Error al cargar los partidos políticos';
      }
    );
  }

  openEditModal(user: User): void {
    this.editUser = { ...user };
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  openDeleteModal(id: string): void {
    this.deleteUserId = id;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  onDelete(id: string | { $oid: string }): void {
    this.userService.deleteUser(id).subscribe(
      (response) => {
        if (response.success) {
          this.loadUsers();
          this.closeDeleteModal();
        } else {
          this.errorMessage = 'Error al eliminar el usuario';
        }
      },
      (error) => {
        this.errorMessage = 'Error al conectar con el servidor';
      }
    );
  }

  onUpdate(id: string | { $oid: string }, updatedUser: Partial<User>): void {
    const userId = getIdString(id);
    const userToUpdate = { ...updatedUser };
    delete (userToUpdate as any)._id;
  
    this.userService.updateUserWithId(userId, userToUpdate).subscribe(
      (response) => {
        if (response.success) {
          this.loadUsers();
          this.closeEditModal();
        } else {
          this.errorMessage = 'Error al actualizar el usuario';
        }
      },
      (error) => {
        this.errorMessage = 'Error al conectar con el servidor';
      }
    );
  }
    
}
