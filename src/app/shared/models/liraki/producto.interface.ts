export interface Producto {
  idProducto?: string;
  creadoEn?: Date;
  nombre: string;
  descripcion: string;
  urlImg?: string;
  filerefImg?: string;
  categorias: string[];
  precio?: number;
  moneda?: string;
  stock: number;
  estado?: boolean;
}
