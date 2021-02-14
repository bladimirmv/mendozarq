import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest, HttpProgressEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CarpetaProyecto, DocumentoProyCarpeta, DocumentoProyecto, Path } from '@app/shared/models/mendozarq/documentos.proyecto.interface';
import { environment } from '@env/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  private API_URL = environment.API_URL;


  constructor(private http: HttpClient, private toastrSvc: ToastrService) {

  }

  // ====================> addCarpetaProyecto
  public addCarpetaProyecto(carpetaProyecto: CarpetaProyecto): Observable<CarpetaProyecto> {
    return this.http
      .post<CarpetaProyecto>(`${this.API_URL}/api/documentos/carpeta`, carpetaProyecto)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getOneCarpetaProyecto
  public getOneCarpetaProyecto(uuid: string): Observable<CarpetaProyecto> {
    return this.http
      .get<CarpetaProyecto>(`${this.API_URL}/api/documentos/carpeta/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllCarpetaProyecto
  public getAllCarpetaProyecto(): Observable<CarpetaProyecto[]> {
    return this.http
      .get<CarpetaProyecto[]>(`${this.API_URL}/api/documentos/carpeta`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllCarpetaProyectoByUuid
  public getAllCarpetaProyectoByUuid(uuid: string): Observable<CarpetaProyecto[]> {
    return this.http
      .get<CarpetaProyecto[]>(`${this.API_URL}/api/documentos/carpetas/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> updateCarpetaProyecto
  public updateCarpetaProyecto(uuid: string, carpetaProyecto: CarpetaProyecto): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/documentos/carpeta/${uuid}`, carpetaProyecto)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> deleteCarpetaProyecto
  public deleteCarpetaProyecto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/documentos/carpeta/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }




  // ====================> addDocumentoProyecto
  public addDocumentoProyecto(documentoProyecto: DocumentoProyecto, file: File): Observable<any> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('documento', JSON.stringify(documentoProyecto));

    return this.http
      .post(`${this.API_URL}/api/documentos`, formdata, {
        reportProgress: true,
        observe: 'events'
      });
  }

  // ====================> getAllDocumentoProyectoByUuid
  public getAllDocumentoProyectoByUuid(uuid: string, path: Path): Observable<DocumentoProyecto[]> {
    return this.http
      .get<DocumentoProyecto[]>(`${this.API_URL}/api/documentos/uuidProy/${uuid}/path/${path}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> deleteDocumentoProyecto
  public deleteDocumentoProyecto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/documentos/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> updateDocumentoProyecto
  public updateDocumentoProyecto(uuid: string, documentoProyecto: DocumentoProyecto): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/documentos/${uuid}`, documentoProyecto)
      .pipe(catchError(error => this.handdleError(error)));
  }



  // ====================> addDocumentoCarpeta
  public addDocumentoCarpeta(documentoCarpeta: DocumentoProyCarpeta, file: File): Observable<any> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('documento', JSON.stringify(documentoCarpeta));

    return this.http
      .post(`${this.API_URL}/api/documentos/docCarpeta`, formdata, {
        reportProgress: true,
        observe: 'events'
      });
  }

  // ====================> getAllDocumentoCarpetaByUuid
  public getAllDocumentoCarpetaByUuid(uuid: string, path: Path): Observable<DocumentoProyecto[]> {
    return this.http
      .get<DocumentoProyecto[]>(`${this.API_URL}/api/documentos/uuidCarpeta/${uuid}/path/${path}`)
      .pipe(catchError(error => this.handdleError(error)));
  }



  // ====================> handdleError
  public handdleError(httpError: HttpErrorResponse): Observable<never> {

    let errorMessage = '';
    if (httpError) {
      // JSON.parse(httpError);
      if (typeof httpError.error.message === 'string') {
        errorMessage = httpError.error.message;
      } else {
        switch (httpError.error.message.errno) {
          case -111:
            errorMessage = 'No se ha podido establecer una conexion con el servidor. 🙁';
            break;
          case 1451:
            errorMessage = 'No se puede eliminar por que esta carpeta no esta vacia. 🙁';
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
