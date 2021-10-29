import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';

import { FotoProducto, Producto, ResponseProducto } from '@models/liraki/producto.interface';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class ProductoService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient, private toastrSvc: ToastrService) { }

  // ====================================================================
  public addProducto(producto: Producto): Observable<Producto | ResponseProducto> {
    return this.http
      .post<Producto>(`${this.API_URL}/api/producto`, producto)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public updateProducto(uuid: string, producto: Producto & { categorias: string[] }): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/producto/${uuid}`, producto)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public getAllProductos(): Observable<Producto[]> {
    return this.http
      .get<Producto[]>(`${this.API_URL}/api/producto`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public getOneProducto(uuid: string): Observable<Producto> {
    return this.http
      .get<Producto>(`${this.API_URL}/api/producto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public deleteProducto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/producto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }



  // ====================> addDocumentoProyecto
  public addFotoProyecto(fotoProducto: FotoProducto, file: File): Observable<any> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('fotoProducto', JSON.stringify(fotoProducto));

    return this.http
      .post(`${this.API_URL}/api/producto/fotoProducto`, formdata, {
        reportProgress: true,
        observe: 'events'
      });
  }

  public getFotoProducto(uuid: string): Observable<FotoProducto[]> {
    return this.http
      .get<FotoProducto[]>(`${this.API_URL}/api/producto/fotoProducto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================================================================
  public deleteFotoProducto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/producto/fotoProducto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public updateFotoProducto(uuid: string, fotoProducto: FotoProducto): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/producto/fotoProducto/${uuid}`, fotoProducto)
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
            errorMessage = 'No se puede eliminar por que este producto esta relacionado con uno o mas tablas. 🙁';
            break;
          case 1062:
            errorMessage = 'Ya existe un producto con ese mismo nombre, porfavor igrese uno nuevo en su lugar. 🙁';
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
