import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest, HttpProgressEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CarpetaProyecto, DocumentoProyecto } from '@app/shared/models/mendozarq/documentos.proyecto.interface';
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




  addDocument(documentoProyecto: DocumentoProyecto, file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('documento', JSON.stringify(documentoProyecto));

    const req = new HttpRequest('POST', `${this.API_URL}/api/documentos`, formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  put(): Observable<any> {
    return new Observable((success => {
      const progressEvent = {} as HttpProgressEvent;
      progressEvent.type = HttpEventType.UploadProgress;
      progressEvent.total = 100;
      progressEvent.loaded = 0;

      setInterval(() => {
        if (progressEvent.loaded < progressEvent.total) {
          progressEvent.loaded += 1;
          success.next(progressEvent);
        } else {
          success.complete();
        }
      })

    }));
  }



  // ====================> getAllDocumentoProyectoByUuid
  public getAllDocumentoProyectoByUuid(uuid: string): Observable<DocumentoProyecto[]> {
    return this.http
      .get<DocumentoProyecto[]>(`${this.API_URL}/api/documentos/uuidProy/${uuid}`)
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
            errorMessage = 'No se puede eliminar por que esta carpeta esta relacionado con un proyecto u otra tabla. 🙁';
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
