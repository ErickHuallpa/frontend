export interface MongoDBObjectId {
  $oid: string;
}

export type PartidoPoliticoId = string | MongoDBObjectId;

export interface PartidoPoliticoBase {
  nombre: string;
  descripcion: string;
  fundacion: Date | string;
  logoUrl: string;
  siglas: string;
}

export interface PartidoPolitico extends PartidoPoliticoBase {
  _id: PartidoPoliticoId;
}

export function getIdString(id: PartidoPoliticoId): string {
  return typeof id === 'string' ? id : id.$oid;
}