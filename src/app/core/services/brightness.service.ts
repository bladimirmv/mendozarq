import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrightnessService {
  private brightness: BehaviorSubject<number> = new BehaviorSubject<number>(
    100
  );
  public brightness$ = this.brightness.asObservable();

  private theme: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public theme$ = this.theme.asObservable();
  constructor() {
    this.checkValue();
  }
  ChangeValue(value: number): void {
    localStorage.setItem('brightness', value as any);
    this.brightness.next(value);
  }

  toggleTheme(value: boolean) {
    localStorage.setItem('theme', value == true ? 'dark' : 'light');

    const body = document.querySelector('body');
    body.classList.remove('dark-theme');

    if (value) {
      body.classList.add('dark-theme');
    }

    this.theme.next(value);
  }

  checkValue(): void {
    const value: number = localStorage.getItem('brightness') as any;
    this.brightness.next(value);

    const theme: string = localStorage.getItem('theme') as any;
    this.theme.next(theme ? (theme == 'dark' ? true : false) : false);
  }
  reset(): void {
    this.ChangeValue(100);

    const body = document.querySelector('body');
    body.classList.remove('dark-theme');
  }
}
