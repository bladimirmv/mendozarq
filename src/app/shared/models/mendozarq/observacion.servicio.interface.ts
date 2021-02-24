export type Estado = 'En curso' | 'Pendiente' | 'Con retraso' | 'Fecha limite' | 'Finalizado';
export interface ObservacionServicio {
  idObsrParticipante?: string;
  creadoEn?: Date;
  idVisita: string;
  estado: Estado;
  idServicio?: string;
  descripcion?: string;
}
