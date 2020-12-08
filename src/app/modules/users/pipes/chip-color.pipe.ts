import { Roles } from '@app/shared/models/usuario.interface';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chipColor'
})
export class ChipColorPipe implements PipeTransform {

  transform(rol: Roles): string {
    const basicStyle = `
    color: white;
    font-weight: bold;
    border-radius: 25px;
    padding: 3px 0;`;

    switch (rol) {
      case 'administrador':
        return `${basicStyle} background-color: #FF6058`;
        break;
      case 'arquitecto':
        return `${basicStyle} background-color: #FFBB33`;
        break;
      case 'vendedor':
        return `${basicStyle} background-color: #FF6058`;
        break;
      case 'cliente':
        return `${basicStyle} background-color: #33B5E5`;
        break;
      default:
        break;
    }
  }

}
