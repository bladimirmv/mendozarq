export type Roles = 'administrador' | 'arquitecto' | 'cliente' | 'vendedor';
export interface Usuario {
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
