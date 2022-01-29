export type tipoVenta = 'online' | 'fisica';
export type metodoPago = 'efectivo' | 'tarjeta' | 'paypal';

export interface Venta {
  uuid: string;
  creadoEn?: Date;
  uuidCliente: string;
  uuidVendedor?: string;
  tipoVenta: tipoVenta;
  metodoPago: metodoPago;
}

export interface DetalleVentaProducto {
  uuid: string;
  creadoEn?: Date;
  uuidVentaProducto: string;
  uuidProducto: string;
  cantidad: number;
  precio: number;
}

export interface VentaProducto extends Venta {
  detalleVenta: Array<DetalleVentaProducto>;
}

export interface VentaProductoView extends VentaProducto {
  cliente: string;
  vendedor: string;
  total: number;
}
