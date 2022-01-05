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

  public ChangeValue(value: number): void {
    localStorage.setItem('brightness', value as any);
    this.brightness.next(value);
  }

  public toggleTheme(theme: boolean) {
    localStorage.setItem('theme', theme == true ? 'dark' : 'light');
    const body = document.querySelector('body');
    body.classList.remove('dark-theme');
    if (theme) {
      body.classList.add('dark-theme');
    }
    this.theme.next(theme);
  }

  public checkValue(): void {
    const value: number = localStorage.getItem('brightness') as any;
    this.brightness.next(value);

    const theme: string = localStorage.getItem('theme') as any;
    const themeValue: boolean = theme
      ? theme == 'dark'
        ? true
        : false
      : false;
    this.theme.next(themeValue);
    this.toggleTheme(themeValue);
  }

  public reset(): void {
    this.ChangeValue(100);
    const body = document.querySelector('body');
    body.classList.remove('dark-theme');
  }
}
