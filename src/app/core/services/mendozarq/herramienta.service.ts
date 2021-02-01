import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Herramienta } from '@models/mendozarq/herramienta';
import { environment } from '@env/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class HerramientaService {
  private API_URL = environment.API_URL;


  constructor(private http: HttpClient, private toastrSvc: ToastrService) {

  }

  // ====================> addHerramienta
  public addHerramienta(file: File, herramienta: Herramienta): Observable<any> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('herramienta', String(herramienta));

    const req = new HttpRequest('POST', `${this.API_URL}/api/herramienta`, formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req)
      .pipe(catchError(error => this.handdleError(error)));

  }

  // ====================> getOneHerramienta
  public getOneHerramienta(uuid: string): Observable<Herramienta> {
    return this.http
      .get<Herramienta>(`${this.API_URL}/api/Herramienta/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // // ====================> getAllHerramienta
  // public getAllHerramienta(): Observable<Herramienta[]> {
  //   return this.http
  //     .get<Herramienta[]>(`${this.API_URL}/api/Herramienta`)
  //     .pipe(catchError(error => this.handdleError(error)));
  // }

  // // ====================> updateHerramienta
  // public updateHerramienta(uuid: string, Herramienta: Herramienta): Observable<any> {
  //   return this.http
  //     .put(`${this.API_URL}/api/Herramienta/${uuid}`, Herramienta)
  //     .pipe(catchError(error => this.handdleError(error)));
  // }

  // // ====================> deleteHerramienta
  // public deleteHerramienta(uuid: string): Observable<any> {
  //   return this.http
  //     .delete(`${this.API_URL}/api/Herramienta/${uuid}`)
  //     .pipe(catchError(error => this.handdleError(error)));
  // }

  // ====================> handdleError
  public handdleError(httpError: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (httpError) {
      typeof httpError.error.message === 'string'
        ? errorMessage = `${httpError.error.message}`
        : errorMessage = `
        Error: ${httpError.statusText} </br>
        Status: ${httpError.status}`;
    }
    console.log('this error', httpError);
    this.toastrSvc.error(errorMessage, 'Ocurrio un Error!', {
      timeOut: 7000,
      enableHtml: true
    });
    return throwError(httpError);
  }

}

