import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.scss']
})
export class CronogramaComponent implements OnInit {

  private toDay;

  constructor() {
  }

  ngOnInit(): void {

    moment.locale('es');
    const gg = moment().format('DD dddd MMMM YYYY');

    console.log(gg);

  }

}
