import { CategoriaProducto } from './../../../shared/models/liraki/categoria.producto.interface';
import { Pipe, PipeTransform } from '@angular/core';
import { CategoriaProyecto } from '@app/shared/models/mendozarq/categoria.proyecto.interface';

@Pipe({
  name: 'getCategories'
})
export class GetCategoriesPipe implements PipeTransform {

  transform(categories: CategoriaProyecto[]): string {
    let result = '';
    categories.forEach((cat, index) => {
      if (index + 1 === categories.length) {
        result += `${cat.nombre}.`;
      } else {
        result += `${cat.nombre}, `;
      }
    });
    return result;
  }

}
