export interface Proyecto {
  uuid?: string;
  creadoEn?: Date;
  nombre: string;
  descripcion?: string;
  estado: boolean;
  fechaInicio?: Date;
  fechaFinal?: Date;
  lugarProyecto?: string;
  porcentaje?: number;
  uuidCategoriaProyecto?: string;
  uuidCliente: string;
}
