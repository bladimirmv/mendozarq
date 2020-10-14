export interface VentaProducto {
  idVentaProducto?: string;
  creadoEn?: Date;
  idUsuario: string;
  totalVenta?: number;
  detalleVenta: [
    {
      idProducto: string;
      cantidad: number;
      totalDetalle: number;
    }
  ]
}
