export type Estado = 'En curso' | 'Pendiente' | 'Fecha limite' | 'Finalizado';
export interface ObservacionParticipante {
  idObsrParticipante?: string;
  creadoEn?: Date;
  estado: Estado;
  idParticipante?: string;
  descripcion?: string;
}
