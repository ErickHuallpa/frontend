// src/app/models/user.model.ts
export interface User {
    _id: string;
    username: string;
    role: string;
    partidoId?: string | null;
  }
  