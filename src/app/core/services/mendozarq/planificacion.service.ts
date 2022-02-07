import {
  TareaPlanificacionProyecto,
  CapituloPlanificacionProyecto,
} from './../../../shared/models/charts/planificacion.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  PlanificacionProyecto,
  PlanificacionProyectoView,
} from '@app/shared/models/charts/planificacion.interface';
import { environment } from '@env/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class PlanificacionService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private toastrSvc: ToastrService) {}

  public addPlanificacionProyecto(
    planificacionProyecto: PlanificacionProyecto
  ): Observable<any> {
    return this.http
      .post<PlanificacionProyecto>(
        `${this.API_URL}/api/planificacionProyecto`,
        planificacionProyecto
      )
      .pipe(catchError((error) => this.handdleError(error)));
  }

  public getOnePlanificacionProyecto(
    uuid: string
  ): Observable<PlanificacionProyecto> {
    return this.http
      .get<PlanificacionProyecto>(
        `${this.API_URL}/api/planificacionProyecto/${uuid}`
      )
      .pipe(catchError((error) => this.handdleError(error)));
  }

  public getAllPlanificacionProyectoByUuid(
    uuid: string
  ): Observable<PlanificacionProyectoView> {
    return this.http
      .get<PlanificacionProyectoView>(
        `${this.API_URL}/api/planificacionProyecto/all/${uuid}`
      )
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // public updatePlanificacionProyecto(
  //   uuid: string,
  //   planificacionProyecto: PlanificacionProyecto
  // ): Observable<any> {
  //   return this.http
  //     .put(
  //       `${this.API_URL}/api/planificacionproyecto/${uuid}`,
  //       planificacionProyecto
  //     )
  //     .pipe(catchError((error) => this.handdleError(error)));
  // }

  public deletePlanificacionProyecto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/planificacionProyecto/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // *Tarea planificacion
  public addTareaPlanificacionProyecto(
    tareaPlanificacionProyecto: TareaPlanificacionProyecto
  ): Observable<any> {
    return this.http
      .post<TareaPlanificacionProyecto>(
        `${this.API_URL}/api/planificacionProyecto/tarea`,
        tareaPlanificacionProyecto
      )
      .pipe(catchError((error) => this.handdleError(error)));
  }

  public deleteTareaPlanificacionProyecto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/planificacionProyecto/tarea/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // *Capitulo planificacion
  public addCapituloPlanificacionProyecto(
    tareaPlanificacionProyecto: CapituloPlanificacionProyecto
  ): Observable<any> {
    return this.http
      .post<CapituloPlanificacionProyecto>(
        `${this.API_URL}/api/planificacionProyecto/capitulo`,
        tareaPlanificacionProyecto
      )
      .pipe(catchError((error) => this.handdleError(error)));
  }

  public deleteCapituloPlanificacionProyecto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/planificacionProyecto/capitulo/${uuid}`)
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
              'No se ha podido establecer una conexion con la base de datos. 🙁';
            break;
          case 1451:
            errorMessage =
              'No se puede eliminar, por que uno o mas tablas estan relacionados con esta planificacion. 🙁';
            break;
          default:
            errorMessage = `
            Error: ${httpError.statusText}</br>
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
