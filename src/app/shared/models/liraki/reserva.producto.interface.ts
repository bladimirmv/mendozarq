export type Estado = 'En curso' | 'Pendiente' | 'Finalizado';
export interface ReservaProducto {
  idReservaProducto?: string;
  creadoEn?: Date;
  idUsuario: string;
  estado: string;
  detalleReserva: [
    {
      idProducto: string;
      cantidad: number;
    }
  ]
}
