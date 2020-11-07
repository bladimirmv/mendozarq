
export type Estado = 'En curso' | 'Ausente' | 'Justificado';
export interface AsistenciaVisita {
  idAsistencia?: string;
  creadoEn?: Date;
  idParticipante?: string;
  idVisitaProyecto: string;
  estado: Estado;
}
