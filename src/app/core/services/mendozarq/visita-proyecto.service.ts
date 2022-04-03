import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { VisitaProyecto } from '@models/mendozarq/visita.proyecto.interface';
import { environment } from '@env/environment.prod';
import { TareaPlanificacionProyecto } from '@app/shared/models/charts/planificacion.interface';

@Injectable({
  providedIn: 'root',
})
export class VisitaProyectoService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private toastrSvc: ToastrService) {}

  // ====================> addVisitaProyecto
  public addVisitaProyecto(visitaProyecto: VisitaProyecto): Observable<any> {
    return this.http
      .post<VisitaProyecto>(
        `${this.API_URL}/api/visitaProyecto`,
        visitaProyecto
      )
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> getOneVisitaProyecto
  public getOneVisitaProyecto(uuid: string): Observable<VisitaProyecto> {
    return this.http
      .get<VisitaProyecto>(`${this.API_URL}/api/visitaProyecto/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> getAllVisitaProyecto
  public getAllVisitaProyecto(
    uuidProyecto: string
  ): Observable<VisitaProyecto[]> {
    return this.http
      .get<VisitaProyecto[]>(
        `${this.API_URL}/api/visitaProyecto/proyecto/${uuidProyecto}`
      )
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> updateVisitaProyecto
  public updateVisitaProyecto(
    uuid: string,
    visitaProyecto: VisitaProyecto
  ): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/visitaProyecto/${uuid}`, visitaProyecto)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> deleteVisitaProyecto
  public deleteVisitaProyecto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/visitaProyecto/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> getAllVisitaProyecto
  public getAllTareasProyecto(
    uuidProyecto: string
  ): Observable<TareaPlanificacionProyecto[]> {
    return this.http
      .get<TareaPlanificacionProyecto[]>(
        `${this.API_URL}/api/visitaProyecto/tarea/proyecto/${uuidProyecto}`
      )
      .pipe(catchError((error) => this.handdleError(error)));
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
            errorMessage =
              'No se ha podido establecer una conexion con el servidor. 🙁';
            break;
          case 1451:
            errorMessage =
              'No se puede eliminar por que este visita esta relacionado con una observacion u otra tabla. 🙁';
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
      enableHtml: true,
    });
    return throwError(httpError);
  }
}
