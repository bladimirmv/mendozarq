import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiHandleErrorService {

  constructor(private toastrSvc: ToastrService) { }

  // ====================> handdleError
  public handdleError(httpError: HttpErrorResponse | any, message1451: string): Observable<never> {
    let errorMessage = '';

    if (httpError.error.message) {
      if (typeof httpError.error.message === 'string') {
        errorMessage = `${httpError.error.message}`;
      } else if (httpError.error.message.errno) {
        switch (httpError.error.message.errno) {
          case -111:
            errorMessage = 'No se ha podido establecer una conexion con el servidor. 🙁';
            break;
          case 1451:
            errorMessage = message1451;
            break;
          default:
            errorMessage = `
            Error: ${httpError.statusText}
            </br>
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
