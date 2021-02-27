import { Pipe, PipeTransform } from '@angular/core';
import { ServicioProyecto } from '@models/mendozarq/servicio.proyecto.interface';

@Pipe({
  name: 'countServicio'
})
export class CountServicioPipe implements PipeTransform {

  transform(servicios: ServicioProyecto[], type: 'total' | 'en_curso' | 'finalizado'): number {
    let count: number = 0;
    if (servicios) {
      switch (type) {
        case 'total':
          count = servicios.length;
          break;
        case 'en_curso':
          servicios.forEach((servicio: ServicioProyecto) => {
            servicio.avance < 100 ? count += 1 : false;
          });
          break;
        case 'finalizado':
          servicios.forEach((servicio: ServicioProyecto) => {
            servicio.avance == 100 ? count += 1 : false;
          });
          break;
        default:
          break;
      }
    }

    return count;
  }

}
