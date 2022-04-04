import { ObservacionObraView } from './../../../shared/models/mendozarq/observacion.obra.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';

import {
  FotoObservacionObra,
  ObservacionObra,
  ObservacionResponse,
} from '@models/mendozarq/observacion.obra.interface';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ObservacionObraService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient, private toastrSvc: ToastrService) {}

  // ====================================================================
  public addObservacionObra(
    observacionObra: ObservacionObra
  ): Observable<ObservacionObra | ObservacionResponse> {
    return this.http
      .post<ObservacionObra>(
        `${this.API_URL}/api/observacionObra`,
        observacionObra
      )
      .pipe(catchError((error) => this.handdleError(error)));
  }
  // ====================================================================
  public updateObservacionObra(
    uuid: string,
    observacionObra: ObservacionObra
  ): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/observacionObra/${uuid}`, observacionObra)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================================================================
  public getObservacionObraByUuidVisita(
    uuid: string
  ): Observable<ObservacionObraView[]> {
    return this.http
      .get<ObservacionObraView[]>(`${this.API_URL}/api/observacionObra/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
  }
  // ====================================================================
  public deleteObservacionObra(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/observacionObra/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> addDocumentoProyecto
  public addFotoObservacion(
    fotoObs: FotoObservacionObra,
    file: File
  ): Observable<any> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('fotoObservacion', JSON.stringify(fotoObs));

    return this.http.post(
      `${this.API_URL}/api/observacionObra/foto`,
      formdata,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  // ====================================================================
  public deleteFotoObservacion(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/observacionObra/foto/${uuid}`)
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
              'No se puede eliminar por que este observacionObra esta relacionado con uno o mas tablas. 🙁';
            break;
          case 1062:
            errorMessage =
              'Ya existe un observacionObra con ese mismo nombre, porfavor igrese uno nuevo en su lugar. 🙁';
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
