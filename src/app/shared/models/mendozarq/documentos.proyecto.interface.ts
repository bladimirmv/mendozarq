export interface CarpetaProyecto {
  uuid: string;
  creadoEn: Date;
  nombre: string;
  fechaCreacion: Date;
  uuidProyecto: string;
}

export interface DocumentoProyecto {
  uuid: string;
  creadoEn: Date;
  originalName: string;
  key: string;
  urlFile: string;
  fechaCreacion: Date;
  uuidProyecto: string;
}

export interface DocumentoCarpeta {
  uuidDocumento: string;
  uuidCarpeta: string;
}
