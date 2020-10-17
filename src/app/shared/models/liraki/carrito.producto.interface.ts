import { Producto } from './producto.interface';
export interface CarritoProducto {
  idCarrito?: string;
  idUsuario: string;
  detalleCarrito: [
    {
      producto: Producto[];
      cantidad: number;
      totalDetalle: number;
    }
  ]
}
