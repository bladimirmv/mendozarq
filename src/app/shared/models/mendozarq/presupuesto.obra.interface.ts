export interface PresupuestoDeObra {
  idPresupuesto?: string;
  creadoEn?: Date;
  nombre: string;
  descripcion?: string;
  idProyecto?: string;
  idCliente?: string;
  totalPresupuesto: number;
}
