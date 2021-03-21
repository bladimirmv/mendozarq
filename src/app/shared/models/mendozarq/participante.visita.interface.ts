import { Usuario } from './../usuario.interface';

export interface ParticipanteVisita {
  uuid?: string;
  creadoEn?: Date;
  uuidVisitaProyecto: string;
  uuidUsuario: string;
}

export interface UsuarioVisita extends Usuario {
  uuidParticipanteVisita: string;
}
