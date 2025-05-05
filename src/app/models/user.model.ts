export interface MongoDBObjectId{
  $oid: string;
}

export type UserId = string | MongoDBObjectId;

export interface UserBase {
    username: string;
    role: string;
    partidoId?: string | null;
}

export interface User extends UserBase{
  _id: UserId;
}

export function getIdString(id: UserId): string{
  return typeof id === 'string' ? id : id.$oid;
}

  