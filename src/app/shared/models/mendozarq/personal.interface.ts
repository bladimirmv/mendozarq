export interface Personal {
  uuid?: string;
  creadoEn?: Date;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  celular?: number;
  direccion?: string;
  correo?: string;
  descripcion?: string;
  sueldo?: number;
  moneda?: 'bs' | 'usd';
  activo?: boolean;
}
