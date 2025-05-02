import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PartidoPoliticoComponent } from './pages/partido-politico/partido-politico.component';
import { CronogramaComponent } from './pages/cronograma/cronograma.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { CandidatoComponent } from './pages/candidato/candidato.component';
import { PropuestaComponent } from './pages/propuesta/propuesta.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'partido-politico', component: PartidoPoliticoComponent },
      { path: 'candidatos', component: CandidatoComponent },
      { path: 'cronograma', component: CronogramaComponent },
      { path: 'propuesta', component: PropuestaComponent },
      { path: '', redirectTo: 'partido-politico', pathMatch: 'full' },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];