export interface ServicioProyecto {
  idServicio?: string;
  creadoEn?: Date;
  idProyecto: string;
  nombre: string;
  descripcion: string;
  avance: number;
  fechaInicio: Date;
  fechaFinal: string;
}
