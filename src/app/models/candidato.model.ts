// src/models/candidato.model.ts
export interface MongoDBObjectId {
    $oid: string;
  }
  
  export type CandidatoId = string | MongoDBObjectId;
  
  export interface CandidatoBase {
    nombre: string;
    edad: number;
    cargo: string;
    partidoId: string;
    votos?: number;
    foto?: string;
  }
  
  export interface Candidato extends CandidatoBase {
    _id: CandidatoId;
  }
  
  // Función helper para extraer el ID como string
  export function getIdString(id: CandidatoId): string {
    return typeof id === 'string' ? id : id.$oid;
  }