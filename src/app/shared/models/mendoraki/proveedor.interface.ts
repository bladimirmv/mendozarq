export interface Proveedor {
  uuid?: string;
  creadoEn?: Date;
  nombre: string;
  celular: number;
  direccion: string;
  descripcion: string;
  uuidRecurso?: string;
}

export interface ProveedorView extends Proveedor {
  recurso?: string | null;
}
