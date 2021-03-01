import { Pipe, PipeTransform } from '@angular/core';
import { VisitaProyecto } from '@app/shared/models/mendozarq/visita.proyecto.interface';
import * as moment from 'moment';

@Pipe({
  name: 'countVisita'
})
export class CountVisitaPipe implements PipeTransform {


  transform(visitas: VisitaProyecto[], type: 'total' | 'en_curso' | 'finalizado'): number {
    let count: number = 0;

    switch (type) {
      case 'total':
        count = visitas.length;
        break;
      case 'en_curso':
        visitas.forEach((visita: VisitaProyecto) => {
          moment(visita.fecha) > moment() ? count += 1 : false;
        });
        break;
      case 'finalizado':
        visitas.forEach((visita: VisitaProyecto) => {
          moment(visita.fecha) < moment() ? count += 1 : false;
        });
        break;
      default:
        break;
    }
    return count;
  }

}
