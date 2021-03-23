import { Usuario } from './../usuario.interface';
import { VisitaProyecto } from './visita.proyecto.interface';

export interface ParticipanteVisita {
  uuid?: string;
  creadoEn?: Date;
  uuidVisitaProyecto: string;
  uuidUsuario: string;
}

export interface UsuarioVisita extends Usuario {
  uuidParticipanteVisita?: string;
}

export interface VisitasPendientes extends VisitaProyecto {
  proyecto?: string;
}
