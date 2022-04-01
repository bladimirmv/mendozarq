export interface Recurso {
  uuid?: string;
  creadoEn?: Date;
  nombre: string;
  descripcion: string;
  tipoRecurso: 'materia_prima' | 'maquinas' | 'material_de_construccion';
  area: 'mendozarq' | 'liraki' | 'mendoraki';
  precioUnitario: number;
  precioPorMayor: number;
}
