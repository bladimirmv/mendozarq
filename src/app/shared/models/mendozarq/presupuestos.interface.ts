export interface PresupuestoObra {
  uuid?: string;
  creadoEn?: Date;
  nombre?: string;
  descripcion?: string;
  fecha?: Date;
  iva?: number;
  uuidCliente: string;
  uuidUsuario: string;
}

export interface PresupuestoProyecto {
  uuidPresupuestoObra: string;
  uuidProyecto?: string;
}

export interface CapituloPresupuesto {
  uuid?: string;
  creadoEn?: Date;
  nombre?: string;
  numero?: number;
  uuidPresupuestoObra: string;
}

export interface DetalleCapitulo {
  uuid?: string;
  creadoEn?: Date;
  descripcion?: string;
  unidad?: string;
  cantidad?: number;
  precioUnitario?: number;
  total?: number;
  uuidCapituloPresupuesto: string;
}
