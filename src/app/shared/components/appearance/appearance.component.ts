import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrightnessService } from '@app/core/services/brightness.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss'],
})
export class AppearanceComponent implements OnInit, OnDestroy {
  public darkTheme: boolean = false;

  private destroy$: Subject<any> = new Subject<any>();

  constructor(public brightnessSvc: BrightnessService) {
    this.brightnessSvc.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.darkTheme = res;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formatLabel(value: number) {
    return Math.round(((value - 40) * 100) / 60);
  }

  public changeRadio(value: boolean): void {
    this.darkTheme = value;
    this.toogleTheme();
  }

  onBrightness(e): void {
    this.brightnessSvc.ChangeValue(e.value);
  }

  public toogleTheme(): void {
    this.brightnessSvc.toggleTheme(this.darkTheme);
  }
}
