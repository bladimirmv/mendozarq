import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {
  OpinionProducto,
  OpinionProductoView,
} from '@models/liraki/opinion.producto.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OpinionProductoService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient, private toastrSvc: ToastrService) {}

  public addOpinion(opinion: OpinionProducto): Observable<OpinionProducto> {
    return this.http
      .post<OpinionProducto>(`${this.API_URL}/api/opinionProducto`, opinion)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  public getAllOpinion(): Observable<OpinionProductoView[]> {
    return this.http
      .get<OpinionProductoView[]>(`${this.API_URL}/api/opinionProducto`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  public getAllOpinionByUuid(uuid: string): Observable<OpinionProductoView[]> {
    return this.http
      .get<OpinionProductoView[]>(`${this.API_URL}/api/opinionProducto/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  public updateOpinion(opinion: OpinionProductoView): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/opinionProducto/${opinion.uuid}`, opinion)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  public deleteOpinion(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/opinionProducto/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> handdleError
  public handdleError(httpError: HttpErrorResponse | any): Observable<never> {
    let errorMessage = '';
    if (httpError.error.message) {
      if (httpError.error.message.errno) {
        switch (httpError.error.message.errno) {
          case 1451:
            errorMessage =
              'No se puede eliminar por que este producto esta relacionado con uno o mas tablas. 🙁';
            this.toastrSvc.error(errorMessage, 'Ocurrio un Error!', {
              timeOut: 7000,
              enableHtml: true,
            });

            break;
          case 1062:
            errorMessage =
              'Ya existe un producto con ese mismo nombre, porfavor igrese uno nuevo en su lugar. 🙁';
            this.toastrSvc.error(errorMessage, 'Ocurrio un Error!', {
              timeOut: 7000,
              enableHtml: true,
            });
            break;
        }
      }
    }
    console.log('this error', httpError);

    return throwError(httpError);
  }
}
