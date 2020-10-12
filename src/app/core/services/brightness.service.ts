import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrightnessService {
  private brightness = new BehaviorSubject<number>(100);
  public brightness$ = this.brightness.asObservable();
  constructor() { }
  ChangeValue(value: number): void {
    this.brightness.next(value);
  }
}
