export interface ObservacionObra {
  uuid?: string;
  creadoEn?: Date;
  puntoDeInspeccion: string;
  observacion: string;
  levantamientoObservacion: string;
  uuidVisita: string;
}

export interface FotoObservacionObra {
  uuid?: string;
  creadoEn?: Date;
  keyName: string;
  fileName: string;
  location: string;
  size: string;
  uuidObservacionObra: string;
}

export interface ObservacionObraView extends ObservacionObra {
  fotos: FotoObservacionObra[];
}

export interface ObservacionResponse {
  message: string;
  body: string;
}
