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
