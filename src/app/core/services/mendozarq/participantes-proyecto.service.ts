import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Personal } from '@models/mendozarq/personal.interface';
import { environment } from '@env/environment.prod';
import { PersonalProyecto, UsuarioProyecto } from '@app/shared/models/mendozarq/participante.proyecto.interface';
import { Usuario } from '@app/shared/models/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class ParticipantesProyectoService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private toastrSvc: ToastrService) {
  }
  // ====================> addUsuarioProyecto
  public addUsuarioProyecto(usuario: UsuarioProyecto[]): Observable<any> {
    return this.http
      .post<Usuario>(`${this.API_URL}/api/participantes/usuario`, usuario)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================> getAllPersonalProyecto
  public getAllUsuarioProyecto(uuid: string): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(`${this.API_URL}/api/participantes/usuario/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================> getAllUsuarioByUuid
  public getAllUsuarioByUuid(uuid: string): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(`${this.API_URL}/api/participantes/usuario/proyecto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================> deleteUsuarioProyecto
  public deleteUsuarioProyecto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/participantes/usuario/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ***************************************** PersonalProyecto ***************************************

  // ====================> addPersonalProyecto
  public addPersonalProyecto(personal: PersonalProyecto[]): Observable<any> {
    return this.http
      .post<Personal>(`${this.API_URL}/api/participantes/personal`, personal)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getOnePersonalProyecto
  public getOnePersonalProyecto(uuid: string): Observable<Personal> {
    return this.http
      .get<Personal>(`${this.API_URL}/api/personal/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllPersonalProyecto
  public getAllPersonalProyecto(uuid: string): Observable<Personal[]> {
    return this.http
      .get<Personal[]>(`${this.API_URL}/api/participantes/personal/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllPersonalByUuid
  public getAllPersonalByUuid(uuid: string): Observable<Personal[]> {
    return this.http
      .get<Personal[]>(`${this.API_URL}/api/participantes/personal/proyecto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> deletePersonalProyecto
  public deletePersonalProyecto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/participantes/personal/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> handdleError
  public handdleError(httpError: HttpErrorResponse | any): Observable<never> {
    let errorMessage = '';
    if (httpError.error.message) {
      if (typeof httpError.error.message === 'string') {
        errorMessage = `${httpError.error.message}`;
      } else if (httpError.error.message.errno) {
        switch (httpError.error.message.errno) {
          case -111:
            errorMessage = 'No se ha podido establecer una conexion con la base de datos. 🙁';
            break;
          case 1451:
            errorMessage = 'No se puede eliminar por que este personal esta relacionado con un proyecto u otra tabla. 🙁';
            break;
          default:
            errorMessage = `
            Error: ${httpError.statusText} </br>
            Status: ${httpError.status}`;
            break;
        }
      }
    }
    console.log('this error', httpError);

    this.toastrSvc.error(errorMessage, 'Ocurrio un Error!', {
      timeOut: 7000,
      enableHtml: true
    });
    return throwError(httpError);
  }
}
