import { Producto } from './producto.interface';
export interface VentaProducto {
  idVentaProducto?: string;
  creadoEn?: Date;
  idUsuario: string;
  totalVenta?: number;
  detalleVenta: [
    {
      producto: Producto[];
      cantidad: number;
      totalDetalle: number;
    }
  ]
}
