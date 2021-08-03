export interface PresupuestoObra {
  uuid?: string;
  creadoEn?: Date;
  nombre?: string;
  descripcion?: string;
  fecha?: Date;
  iva?: number;
  uuidCliente: string;
  uuidUsuario: string;
  total?: number;
}

export interface PresupuestoObraView {
  uuid?: string;
  creadoEn?: Date;
  nombre?: string;
  descripcion?: string;
  fecha?: Date;
  iva?: number;
  uuidCliente?: string;
  cliente?: string;
  uuidUsuario?: string;
  usuario?: string;
  total?: number;
  totalBruto?: number;
  totalWithIVA?: number;
  totalPresupuesto?: number;
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
  descuento?: number;
  total?: number;
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
export interface CapituloPresupuestoView extends CapituloPresupuesto {
  detalles?: Array<DetalleCapitulo>;
}


export interface Unidad {
  value: string;
  text: string;
}
