import { Pipe, PipeTransform } from '@angular/core';
import { Personal } from './../../../shared/models/mendozarq/personal.interface';

@Pipe({
  name: 'statePersonal'
})
export class StatePersonalPipe implements PipeTransform {

  transform(personal: Personal[], estado: string): number {

    let count: number = 0;
    switch (estado) {
      case 'activo':
        personal.forEach(per => {
          per.activo
            ? count++
            : false;
        });
        break;
      case 'inactivo':
        personal.forEach(per => {
          !per.activo
            ? count++
            : false;
        });
        break;

      default:
        break;
    }

    return count;
  }

}
