export interface PlanificacionProyecto {
  uuid: string;
  creadoEn: Date;
  titulo: string;
  subtitulo: string;
  uuidProyecto: string;
}

export interface CapituloPlanificacionProyecto {
  uuid: string;
  creadoEn?: Date;
  nombre: string;
  fechaInicio: Date;
  fechaFinal?: Date;
  avance?: number;
  dependencia?: string;
  color?: string;
  uuidPlanificacionProyecto?: string;
}

export interface TareaPlanificacionProyecto {
  uuid: string;
  creadoEn?: Date;
  nombre: string;
  fechaInicio: Date;
  fechaFinal?: Date;
  avance?: number;
  dependencia?: string;
  hito?: boolean;
  color?: string;
  uuidCapitulo?: string;
  actividades?: string;
}

export interface PlanificacionProyectoView extends PlanificacionProyecto {
  capitulos: CapituloPlanificacionProyecto[];
  tareas: TareaPlanificacionProyecto[];
}
