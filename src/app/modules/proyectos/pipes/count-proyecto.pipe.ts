import { Pipe, PipeTransform } from '@angular/core';
import { Proyecto } from '@app/shared/models/mendozarq/proyecto.interface';

@Pipe({
  name: 'countProyecto'
})
export class CountProyectoPipe implements PipeTransform {

  transform(proyectos: Proyecto[], type: 'total' | 'en_curso' | 'finalizado'): number {
    let count: number = 0;

    switch (type) {
      case 'total':
        count = proyectos.length;
        break;
      case 'en_curso':
        proyectos.forEach((servicio: Proyecto) => {
          servicio.porcentaje < 100 ? count += 1 : false;
        });
        break;
      case 'finalizado':
        proyectos.forEach((servicio: Proyecto) => {
          servicio.porcentaje == 100 ? count += 1 : false;
        });
        break;
      default:
        break;
    }
    return count;
  }
}
