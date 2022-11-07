import { Component } from '@angular/core';
import { BrightnessService } from './core/services/brightness.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'mendozarq';
  public value: number;
  constructor(private brightnessSvc: BrightnessService) {
    this.brightnessSvc.brightness$.subscribe((res) => (this.value = res));
  }
}
