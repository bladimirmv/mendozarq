export interface DetallePresupuesto {
  idDetallePresupuesto?: string;
  creadoEn?: Date;
  nombre: string;
  idPresupuesto?: string;
  totalDetalle?: number;
  subDetalle?: [
    {
      nombre: string;
      medida: string;
      cantidad: number;
      precioUnitario: number;
      totalSubDetalle?: number;
    }
  ]
}
