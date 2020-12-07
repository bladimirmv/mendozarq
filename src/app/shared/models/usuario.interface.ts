export type Roles = 'administrador' | 'arquitecto' | 'cliente' | 'vendedor';
export interface Usuario {
  uuid?: string;
  creadoEn?: Date;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  celular?: number;
  direccion?: string;
  correo?: string;
  username?: string;
  contrasenha?: string;
  rol?: Roles;
  activo?: boolean;
  generarCredenciales?: boolean;
}



export interface UsuarioResponse {
  // [x: string]: any;
  message: string;
  token: string;
  body?: Usuario;
  error?: any;
}
