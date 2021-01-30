export interface Herramienta {
  uuid?: string;
  creadoEn?: Date;
  nombre: string;
  categoria: 'maquina' | 'manual' | 'otro';
  descripcion?: string;
  estado?: boolean;
  keyImg?: string;
  urlImg?: string;
  filerefImg?: string;
}
