import { Component, OnInit } from '@angular/core';
import { getIdString, Persona } from '../../models/persona.model';
import { PersonaService } from '../../services/persona.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-persona',
  standalone: true,
  templateUrl: './persona.component.html',
  styleUrl: './persona.component.css',
  imports: [FormsModule, CommonModule],
})
export class PersonaComponent implements OnInit {
  personas: Persona[] = [];

  constructor(private personaService: PersonaService) {}

  ngOnInit(): void {
    this.loadPersonas();
  }

  loadPersonas(): void {
    this.personaService.getAllPersonas().subscribe({
      next: (personas) => {
        this.personas = personas;
      },
      error: (err) => {
        console.error('Error al cargar personas:', err);
      },
    });
  }

  getId(id: any): string {
    return getIdString(id);
  }
}
