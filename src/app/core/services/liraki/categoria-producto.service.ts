import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CategoriaProducto } from '@models/liraki/categoria.producto.interface';
import { environment } from '@env/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CategoriaProductoService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private toastrSvc: ToastrService) {}

  public addCategoriaProducto(
    categoriaProducto: CategoriaProducto,
    file: File
  ): Observable<any> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('categoriaProducto', JSON.stringify(categoriaProducto));

    return this.http.post(`${this.API_URL}/api/categoriaProducto`, formdata, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public getOneCategoriaProducto(uuid: string): Observable<CategoriaProducto> {
    return this.http
      .get<CategoriaProducto>(`${this.API_URL}/api/categoriaProducto/${uuid}`, {
        params: {},
      })
      .pipe(catchError((error) => this.handdleError(error)));
  }

  public getAllCategoriaProducto(): Observable<CategoriaProducto[]> {
    return this.http
      .get<CategoriaProducto[]>(`${this.API_URL}/api/categoriaProducto/`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  public updateCategoriaProducto(
    uuid: string,
    categoriaProducto: CategoriaProducto,
    file?: File
  ): Observable<any> {
    if (!file) {
      return this.http
        .put(`${this.API_URL}/api/categoriaproducto/${uuid}`, categoriaProducto)
        .pipe(catchError((error) => this.handdleError(error)));
    }
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('categoriaProducto', JSON.stringify(categoriaProducto));

    console.log('nuevo');

    return this.http.put(
      `${this.API_URL}/api/categoriaProducto/multer/${uuid}`,
      formdata,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  public deleteCategoriaProducto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/categoriaProducto/${uuid}`)
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
          case 1062:
            errorMessage =
              'Ya existe una categoria con ese nombre porfavor ingrese uno nuevo. 🙁';
            break;
          case 1451:
            errorMessage =
              'No se puede eliminar, por que uno o mas productos estan relacionados con esta categoria. 🙁';
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
