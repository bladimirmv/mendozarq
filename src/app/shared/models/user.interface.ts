import { types } from "util";

export type Roles = 'administrador' | 'arquitecto' | 'cliente' | 'vendedor';
export interface User {
  docid?: string;
  uid?: string;
  displayName?: string;
  photoURL?: string;
  nombre: string;
  apellidos: string;
  celular?: number;
  direccion?: string;
  correo?: string;
  contrasenha?: string;
  rol: Roles;
}