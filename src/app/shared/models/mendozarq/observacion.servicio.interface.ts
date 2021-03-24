import { ServicioProyecto } from "./servicio.proyecto.interface";

export type Estado = 'En curso' | 'Pendiente' | 'Con retraso' | 'Fecha limite' | 'Finalizado';
export interface ObservacionServicio {
  uuid?: string;
  creadoEn?: Date;
  estado?: Estado;
  descripcion?: string;
  fecha?: Date;
  uuidServicio: string;
  uuidVisita: string;
}

export interface ObservacionesByServicio extends ServicioProyecto {
  observaciones?: Array<ObservacionServicio>
}
