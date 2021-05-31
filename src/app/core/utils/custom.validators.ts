import { AbstractControl } from '@angular/forms'

export class CustomValidations {

  static numberRange(control: AbstractControl) {
    const value = control.value;

    return null;
  }
}
