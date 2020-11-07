export interface Actividad {
  idActividad?: string;
  creadoEn?: Date;
  creadoPor?: string;
  idCronograma: string;
  nombre?: Date;
  fechaInicio?: Date;
  fechaFinal?: Date;
  porcentaje?: number;
  recurso?: string[];
}
