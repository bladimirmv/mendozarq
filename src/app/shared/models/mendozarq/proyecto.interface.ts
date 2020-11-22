export interface Proyecto {
  idProyecto?: string;
  creadoEn?: Date;
  nombre: string;
  descripcion?: string;
  categoria?: string[];
  estado: boolean;
  fechaInicio?: any;
  fechaFinal?: any;
  lugarProyecto?: string;
  filerefCont?: string;
  urlCont?: string;
  idCliente?: string;
  porcentaje?: number;
}
