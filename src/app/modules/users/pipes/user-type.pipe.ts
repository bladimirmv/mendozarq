import { Pipe, PipeTransform } from '@angular/core';
import { Roles, Usuario } from '@app/shared/models/usuario.interface';

@Pipe({
  name: 'userType',
})
export class UserTypePipe implements PipeTransform {
  transform(users: Usuario[], type: Roles): number {
    let cant = 0;
    users.forEach((user) => (user.rol === type ? cant++ : false));
    return cant;
  }
}
