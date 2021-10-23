import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrightnessService {
  private brightness: BehaviorSubject<number> = new BehaviorSubject<number>(100);
  public brightness$ = this.brightness.asObservable();
  constructor() {
    this.checkValue();
  }
  ChangeValue(value: number): void {
    localStorage.setItem('brightness', value as any);
    this.brightness.next(value);
  }
  checkValue(): void {
    const value: number = localStorage.getItem('brightness') as any;
    this.brightness.next(value);
  }
  reset(): void {
    this.ChangeValue(100)
  }
}
