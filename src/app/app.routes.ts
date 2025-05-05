import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PartidoPoliticoComponent } from './pages/partido-politico/partido-politico.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { CandidatoComponent } from './pages/candidato/candidato.component';
import { VotoComponent } from './pages/voto/voto.component';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { DiaEleccionComponent } from './pages/dia-eleccion/dia-eleccion.component';
import { PersonaComponent } from './pages/persona/persona.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'partido-politico', component: PartidoPoliticoComponent },
      { path: 'candidatos', component: CandidatoComponent },
      { path: 'voto', component: VotoComponent },
      { path: 'home', component: HomeComponent },
      { path: 'users', component: UsersComponent},
      { path: 'dia-eleccion', component: DiaEleccionComponent },
      { path: 'persona', component: PersonaComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];