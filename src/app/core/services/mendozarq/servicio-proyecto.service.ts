import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ServicioProyecto } from '@models/mendozarq/servicio.proyecto.interface';
import { environment } from '@env/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ServicioProyectoService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private toastrSvc: ToastrService) {

  }

  // ====================> addServicioProyecto
  public addServicioProyecto(servicioProyecto: ServicioProyecto): Observable<any> {
    return this.http
      .post<ServicioProyecto>(`${this.API_URL}/api/servicioProyecto`, servicioProyecto)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getOneServicioProyecto
  public getOneServicioProyecto(uuid: string): Observable<ServicioProyecto> {
    return this.http
      .get<ServicioProyecto>(`${this.API_URL}/api/servicioProyecto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllServicioProyecto
  public getAllServicioProyecto(uuidProyecto: string): Observable<ServicioProyecto[]> {
    return this.http
      .get<ServicioProyecto[]>(`${this.API_URL}/api/servicioProyecto/proyecto/${uuidProyecto}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> updateServicioProyecto
  public updateServicioProyecto(uuid: string, servicioProyecto: ServicioProyecto): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/servicioProyecto/${uuid}`, servicioProyecto)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> deleteServicioProyecto
  public deleteServicioProyecto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/servicioProyecto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> handdleError
  public handdleError(httpError: HttpErrorResponse | any): Observable<never> {
    let errorMessage = '';
    if (httpError.error) {
      if (typeof httpError.error.message === 'string') {
        errorMessage = `${httpError.error.message}`;
      } else if (httpError.error.message.errno) {
        switch (httpError.error.message.errno) {
          case -111:
            errorMessage = 'No se ha podido establecer una conexion con el servidor. 🙁';
            break;
          case 1451:
            errorMessage = 'No se puede eliminar por que este servicioProyecto esta relacionado con un proyecto u otra tabla. 🙁';
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
