import { CategoriaProducto } from '@models/liraki/categoria.producto.interface';
import { Usuario } from '@models/usuario.interface';
export interface Proyecto {
  idProyecto?: string;
  creadoEn?: Date;
  nombre: string;
  descripcion?: string;
  categoria?: any[];
  estado: boolean;
  fechaInicio?: any;
  fechaFinal?: any;
  lugarProyecto?: string;
  filerefCont?: string;
  urlCont?: string;
  cliente?: any;
  nombreCliente?: string;
  porcentaje?: number;
}
