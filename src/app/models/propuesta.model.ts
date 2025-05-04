// src/models/propuesta.model.ts
export interface Propuesta {
    _id: string | { $oid: string };
    titulo: string;
    descripcion: string;
    candidatoId: string;
  }
  
  export interface CreatePropuestaDto {
    titulo: string;
    descripcion: string;
    candidatoId: string;
  }
  
  export function getIdString(id: string | { $oid: string }): string {
    return typeof id === 'string' ? id : id.$oid;
  }