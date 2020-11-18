export interface Personal {
  idPersonal?: string;
  creadoEn?: Date;
  nombre?: string;
  apellidos?: string;
  celular?: number;
  direccion?: string;
  correo?: string;
  activo?: boolean;
  cargo?: string;
  sueldo?: number;
  moneda?: 'bs' | 'usd';
  filerefCont?: string;
  urlCont?: string;
}
