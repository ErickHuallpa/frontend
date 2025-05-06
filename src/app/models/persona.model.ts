export interface MongoDBObjectId {
    $oid: string;
  }
  
  export type PersonaId = string | MongoDBObjectId;
  
  export interface Persona {
    _id: PersonaId;
    nombres: string;
    apellidos: string;
    cedulaIdentidad: string;
    ciudad: string;
    fechaNacimiento: string;
    yaVoto: boolean;
  }
  
  export function getIdString(id: PersonaId): string {
    return typeof id === 'string' ? id : id.$oid;
  }
  