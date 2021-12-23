import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Logs } from '@app/shared/models/logs/logs.interface';

import * as moment from 'moment';
import { monitorEventLoopDelay } from 'perf_hooks';

@Component({
  selector: 'app-info-log',
  templateUrl: './info-log.component.html',
  styleUrls: ['./info-log.component.scss'],
})
export class InfoLogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public log: Logs) {
    moment.locale('es');
  }

  public fecha: string = moment(this.log.creadoEn).format('LLLL');

  ngOnInit(): void {}
}
