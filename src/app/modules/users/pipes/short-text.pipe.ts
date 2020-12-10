import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortText'
})
export class ShortTextPipe implements PipeTransform {

  transform(text: string, arg: Array<number>): string {

    return `${text.slice(arg[0], arg[1])} ...`;

  }

}
