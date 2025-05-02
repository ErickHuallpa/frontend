// src/models/actividad.model.ts
export interface MongoDBObjectId {
    $oid: string;
  }
  
  export type ActividadId = string | MongoDBObjectId;
  
  export interface ActividadBase {
    titulo: string;
    descripcion: string;
    fecha: Date | string;
    estado: 'pendiente' | 'en_progreso' | 'completado';
    candidatoId: string;
  }
  
  export interface Actividad extends ActividadBase {
    _id: ActividadId;
  }
  
  export function getIdString(id: ActividadId): string {
    return typeof id === 'string' ? id : id.$oid;
  }