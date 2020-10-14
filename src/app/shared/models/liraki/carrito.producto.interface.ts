export interface CarritoProducto {
  idCarrito?: string;
  idUsuario: string;
  detalleCarrito: [
    {
      idProducto: string;
      cantidad: number;
      totalDetalle: number;
    }
  ]
}
