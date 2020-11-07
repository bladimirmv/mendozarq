export interface Proyecto {
  idProyecto?: string;
  creadoEn?: Date;
  nombre: string;
  descripcion?: string;
  categoria?: string[];
  estado: boolean;
  fechaInicio?: Date;
  fechaFinal?: Date;
  lugarProyecto?: string;
  filerefCont?: string;
  urlCont?: string;
  idCliente?: string;
  porcentaje?: number;
}
