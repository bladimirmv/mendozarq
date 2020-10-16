export type Estado = 'En curso' | 'Pendiente' | 'Fecha limite' | 'Finalizado';
export interface ObservacionParticipante {
  idObsrParticipante?: string;
  creadoEn?: Date;
  idVisita: string;
  estado: Estado;
  idParticipante?: string;
  descripcion?: string;
}
