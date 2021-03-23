import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ParticipanteVisita, UsuarioVisita, VisitasPendientes } from '@models/mendozarq/participante.visita.interface';
import { environment } from '@env/environment.prod';
import { ApiHandleErrorService } from '../errors/api-handle-error.service';
import { Usuario } from '@app/shared/models/usuario.interface';


@Injectable({
  providedIn: 'root'
})
export class ParticipanteVisitaService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private errSvc: ApiHandleErrorService) {
  }

  // ====================> addParticipanteVisita
  public addParticipanteVisita(participanteVisita: ParticipanteVisita[]): Observable<any> {
    return this.http
      .post<ParticipanteVisita>(`${this.API_URL}/api/participanteVisita`, participanteVisita)
      .pipe(catchError(error => this.handdleError(error)));
  }


  // ====================> getAllParticipanteVisita
  public getAllParticipanteVisita(uuidVisita: string): Observable<UsuarioVisita[]> {
    return this.http
      .get<UsuarioVisita[]>(`${this.API_URL}/api/participanteVisita/${uuidVisita}`)
      .pipe(catchError(error => this.handdleError(error)));
  }


  // ====================> getAllParticipanteVisita
  public getAllUsuarioByUuidVisita(uuidVisita: string): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(`${this.API_URL}/api/participanteVisita/uuid/${uuidVisita}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllParticipanteVisita
  public getAllVisitasPendientesByUsuario(uuidUsuario: string): Observable<VisitasPendientes[]> {
    return this.http
      .get<VisitasPendientes[]>(`${this.API_URL}/api/participanteVisita/usuario/${uuidUsuario}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> deleteParticipanteVisita
  public deleteParticipanteVisita(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/participanteVisita/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> handdleError
  public handdleError(httpError: HttpErrorResponse | any): Observable<never> {
    const message1451 = 'No se puede eliminar, por que este usuario esta relacionado con un proyecto u otra tabla. 🙁';
    return this.errSvc.handdleError(httpError, message1451);
  }
}
