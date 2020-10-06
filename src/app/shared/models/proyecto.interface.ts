export interface Proyecto {
  idProyecto?: string;
  creadoEn?: Date;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  tiempo?: Date;
  estado: boolean;
  fechaInicio?: Date;
  fechaFinal?: Date;
  filerefdoc?: string;
  urldoc?: string;
  personal: string[];
  idCliente?: string;
}
