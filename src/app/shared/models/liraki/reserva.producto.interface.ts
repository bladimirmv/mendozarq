import { Producto } from './producto.interface';
export type Estado = 'En curso' | 'Pendiente' | 'Finalizado';
export interface ReservaProducto {
  idReserva?: string;
  creadoEn?: Date;
  idUsuario: string;
  estado: string;
  detalleReserva: [
    {
      producto: Producto;
      cantidad: number;
    }
  ]
}
