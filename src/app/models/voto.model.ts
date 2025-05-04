export interface MongoDBObjectId {
    $oid: string;
  }
  
  export type MongoId = string | MongoDBObjectId;
  
  export interface CreateVotoDto {
    cedulaIdentidad: string;
    presidenteViceId: MongoId;
    gobernadorId: MongoId;
  }
  
  // Función helper para obtener el string del ID
  export function getIdVotoString(id: MongoId): string {
    return typeof id === 'string' ? id : id.$oid;
  }
  