export interface UsuarioProyecto {
  uuid?: string;
  creadoEn?: Date;
  uuidProyecto: string;
  uuidUsuario: string;
}

export interface PersonalProyecto {
  uuid?: string;
  creadoEn?: Date;
  uuidProyecto?: string;
  uuidPersonal?: string;
}
