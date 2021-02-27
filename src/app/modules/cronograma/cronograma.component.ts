import { UsuarioService } from '../../core/services/auth/usuario.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartType, getPackageForChart, ScriptLoaderService } from 'angular-google-charts';
import { AuthService } from '@app/core/services/auth/auth.service';

import * as moment from 'moment';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.scss']
})
export class CronogramaComponent implements OnInit {
  title = 'Browser market shares at a specific website, 2014';
  type = 'Gantt';



  columns = [
    ['string', 'Task ID'],
    ['string', 'Task Name'],
    ['string', 'Resource'],
    ['date', 'Start Date'],
    ['date', 'End Date'],
    ['number', 'Duration'],
    ['number', '% Complete'],
    ['string', 'Dependencies']
  ];

  public data: any[] = [];

  paddingHeight: number;
  rowHeight: number;
  chartHeight: number;

  options = {

  };

  onSelect(e) {
    console.log(e.selection[0].row);

  }

  constructor(private authSvc: UsuarioService) { }


  toDateTime(secs): any {
    const epoch = new Date(0);
    const t = new Date(0);
    console.log(epoch);

    t.setUTCSeconds(secs);


    const year = t.getFullYear() - epoch.getFullYear();
    const month = t.getMonth() + 1;
    const day = t.getDate();

    console.log(year);

    return year + "-" + this.less10(month) + "-" + this.less10(day);
  }
  less10(time): any {
    return time < 10 ? "0" + time : time;
  }



  ngOnInit(): void {

    moment.locale('es');
    const hoy = moment();
    const formato = 'dddd Do MMMM YYYY'
    console.table({
      hoy: hoy.format(formato)
    });





    // google.charts.load('current', { packages: ['gantt'], language: 'es' });
    // this.authSvc.getAllUsuarios()
    //   .subscribe(res => {

    //     res.forEach(e => {
    //       // console.log(this.toDateTime(e.creadoEn));
    //       // console.log(e.creadoEn);

    //     });


    //   this.data = [
    //     ['2014Spring', res[0].nombre, 'dd',
    //       new Date(2005, 2, 22), new Date(2006, 8, 23), 0, 100, null],

    //     ['2014Spring', res[0].nombre, 'dd',
    //       new Date(2014, 2, 22), new Date(2014, 8, 23), 0, 100, null]
    //     ,
    //     ['2014Summer', 'Summer 2014', 'summer',
    //       new Date(2006, 5, 21), new Date(2004, 8, 20), null, 100, null],
    //     ['2014Autumn', 'Autumn 2014', 'autumn',
    //       new Date(2014, 8, 21), new Date(2014, 11, 20), null, 100, null],
    //     ['2014Winter', 'Winter 2014', 'winter',
    //       new Date(2014, 11, 21), new Date(2015, 2, 21), null, 100, null],
    //     ['2015Spring', 'Spring 2015', 'spring',
    //       new Date(2015, 2, 22), new Date(2015, 5, 20), null, 50, null],
    //     ['2015Summer', 'Summer 2015', 'summer',
    //       new Date(2015, 5, 21), new Date(2015, 8, 20), null, 0, null],
    //     ['2015Autumn', 'Autumn 2015', 'autumn',
    //       new Date(2015, 8, 21), new Date(2015, 11, 20), null, 0, null],
    //     ['2015Winter', 'Winter 2015', 'winter',
    //       new Date(2015, 11, 21), new Date(2016, 2, 21), null, 0, null],
    //     ['Football', 'Football Season', 'sports',
    //       new Date(2014, 8, 4), new Date(2015, 1, 1), null, 100, null],
    //     ['Baseball', 'Baseball Season', 'sports',
    //       new Date(2015, 2, 31), new Date(2015, 9, 20), null, 14, null],
    //     ['Basketball', 'Basketball Season', 'sports',
    //       new Date(2014, 9, 28), new Date(2015, 5, 20), null, 86, null],
    //     ['Hockey', 'Hockey Season', 'sports',
    //       new Date(2014, 9, 8), new Date(2015, 5, 21), null, 89, null]
    //   ];

    //   this.paddingHeight = 50;
    //   this.rowHeight = this.data.length * 41;
    //   this.chartHeight = this.rowHeight + this.paddingHeight;
    //   this.options = {
    //     height: this.chartHeight,
    //     gantt: {
    //       criticalPathEnabled: false,
    //       arrow: {
    //         width: 1,
    //         color: '#425066',
    //       },
    //       labelStyle: {
    //         fontName: 'Montserrat',
    //         fontSize: 14,
    //         color: '#757575'
    //       },
    //     }
    //   };
    // });
  }








}
