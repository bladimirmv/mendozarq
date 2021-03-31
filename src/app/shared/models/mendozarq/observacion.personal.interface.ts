import { Personal } from "./personal.interface";

export type Estado = 'En curso' | 'Pendiente' | 'Fecha limite' | 'Aprobar' | 'Con retraso' | 'Finalizado';

export interface ObservacionPersonal {
  uuid?: string;
  creadoEn?: Date;
  estado?: Estado;
  descripcion?: string;
  fecha?: Date;
  uuidPersonal: string;
  uuidVisita: string;
}

export interface ObservacionesByPersonal extends Personal {
  observaciones?: Array<ObservacionPersonal>
}
