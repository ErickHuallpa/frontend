export interface MongoDBObjectId {
  $oid: string;
}

export type EleccionId = string | MongoDBObjectId;

export interface EleccionBase {
  fechaInicio: Date;
  horaInicio: string;
  fechaFin: Date;
}

export interface Eleccion extends EleccionBase {
  _id: EleccionId;
}

export interface CreateEleccionDto {
  fechaInicio: string;
  horaInicio: string;
  fechaFin: string;
}

export interface UpdateEleccionDto extends Partial<CreateEleccionDto> {}

export function getIdString(id: EleccionId): string {
  return typeof id === 'string' ? id : id.$oid;
}