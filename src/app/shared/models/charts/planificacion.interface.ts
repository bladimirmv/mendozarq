export interface PlanificacionProyecto {
  uuid: string;
  creadoEn: Date;
  titulo: string;
  subtitulo: string;
  uuidProyecto: string;
}

export interface TareaPlanificacionProyecto {
  uuid: string;
  creadoEn?: Date;
  nombre: string;
  fechaInicio: Date;
  fechaFinal?: Date;
  avance?: number;
  dependencia?: string;
  uuidPadre?: string;
  hito?: boolean;
  uuidPlanificacionProyecto?: string;
  color?: string;
}

export interface PlanificacionProyectoView extends PlanificacionProyecto {
  data: TareaPlanificacionProyecto[];
}
