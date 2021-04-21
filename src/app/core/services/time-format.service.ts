import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TimeFormatService {

  constructor() {
    moment.locale('es');
  }

  public getDateString(date: Date, complete: boolean): string {
    moment.locale('es');
    return complete
      ? moment(date).format('DD [de] MMMM [del] YYYY, h:mm:ss a')
      : moment(date).format('DD [de] MMMM [del] YYYY');
  }
}
