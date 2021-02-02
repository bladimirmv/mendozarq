export interface Proyecto {
  uuid?: string;
  creadoEn?: Date;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  estado: boolean;
  fechaInicio?: Date;
  fechaFinal?: Date;
  lugarProyecto?: string;
  porcentaje?: number;
  uuidCliente: string;
}
