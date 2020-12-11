export interface Recurso {
  idRecurso: string;
  creadoEn?: Date;
  nombre?: string;  
  filerefImg?: string;
  urlImg?: string;
  estado?: boolean;
  descripcion?: string;
  idCategoriaRecurso?: string;
}
