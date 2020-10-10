export interface Proyecto {
  idProyecto?: string;
  creadoEn?: Date;
  nombre: string;
  descripcion?: string;
  categoria?: string[];
  estado: boolean;
  fechaInicio?: Date;
  fechaFinal?: Date;
  filerefCont?: string;
  urlCont?: string;
  personal: string[];
  idCliente?: string;
}
