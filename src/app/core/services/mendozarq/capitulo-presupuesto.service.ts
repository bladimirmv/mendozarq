import { CapituloPresupuestoView } from './../../../shared/models/mendozarq/presupuestos.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CapituloPresupuesto } from '@models/mendozarq/presupuestos.interface';
import { environment } from '@env/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class CapituloPresupuestoService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private toastrSvc: ToastrService) {
  }

  // ====================>
  public addCapituloPresupuesto(capituloPresupuesto: CapituloPresupuesto): Observable<any> {
    return this.http
      .post<CapituloPresupuesto>(`${this.API_URL}/api/capituloPresupuesto`, capituloPresupuesto)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================>
  public getOneCapituloPresupuesto(uuid: string): Observable<CapituloPresupuesto> {
    return this.http
      .get<CapituloPresupuesto>(`${this.API_URL}/api/capitulopresupuesto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================>
  public getAllCapituloPresupuesto(uuid: string): Observable<CapituloPresupuestoView[]> {
    return this.http
      .get<CapituloPresupuestoView[]>(`${this.API_URL}/api/capitulopresupuesto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================>
  public updateCapituloPresupuesto(uuid: string, capituloPresupuesto: CapituloPresupuesto): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/capitulopresupuesto/${uuid}`, capituloPresupuesto)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================>
  public deleteCapituloPresupuesto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/capitulopresupuesto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================>
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
            errorMessage = 'No se puede eliminar por que este capitulo esta relacionado con un detalle u otra tabla. 🙁';
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
      enableHtml: true
    });
    return throwError(httpError);
  }
}
