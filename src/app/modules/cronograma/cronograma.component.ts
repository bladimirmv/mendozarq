import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts-gantt';

import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.scss'],
})
export class CronogramaComponent implements OnInit {
  @ViewChild('divRef', { static: false }) divReference: ElementRef;

  private spanish: any = {
    viewFullscreen: 'Ver en pantalla completa',
    months: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agostot',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    weekdays: [
      'Domingo',
      'Lunes',
      'Martes',
      'Miercoles',
      'Jueves',
      'Viernes',
      'Sabado',
    ],
    downloadJPEG: 'Descarga JPEG',
    downloadCSV: 'Descarga CSV',
    downloadPDF: 'Descarga PDF',
    downloadPNG: 'Descarga PNG',
    downloadSVG: 'Descarga SVG',
    printChart: 'Imprimir',
  };

  constructor() {}

  ngAfterViewInit() {
    this.highchartclick();
  }
  ngOnInit(): void {}

  highchartclick() {
    Highcharts.setOptions({
      lang: {
        viewFullscreen: 'Ver en pantalla completa',
        months: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
        weekdays: [
          'Domingo',
          'Lunes',
          'Martes',
          'Miercoles',
          'Jueves',
          'Viernes',
          'Sabado',
        ],
        downloadJPEG: 'Descargar JPEG',
        downloadCSV: 'Descargar CSV',
        downloadPDF: 'Descargar PDF',
        downloadPNG: 'Descargar PNG',
        downloadSVG: 'Descargar SVG',
        printChart: 'Imprimir',
        noData: 'Sin datos',
        shortWeekdays: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        shortMonths: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ],
        rangeSelectorFrom: 'Desde',
        rangeSelectorTo: 'Hasta',
      },
      colors: [
        '#ff6e00',
        '#425066',
        '#ffbd2d',
        '#2ac940',
        '#33b5e5',
        '#7d4bc3',
      ],
      chart: {
        style: {
          fontFamily: 'Montserrat',
          backgroundColor: '#000000',
          color: '#ffffff',
          background: '#000000',
        },
      },

      tooltip: {
        xDateFormat: '%A, %b %e, %Y',

        formatter: function () {
          let _this: any = this;
          return `<b>${this.key}</b>
          <br/>
          Inicio: ${Highcharts.dateFormat('%A, %d de %b  %Y', _this.x)}
          <br/>
          Finaliza: ${Highcharts.dateFormat('%A, %d de %b  %Y', _this.x2)}`;
        },
      },
    });

    Highcharts.ganttChart(this.divReference.nativeElement as HTMLElement, {
      title: {
        text: 'Planificación del Proyecto',
      },
      exporting: {
        enabled: true,
      },
      // rangeSelector: {
      //   enabled: true,
      // },

      navigator: {
        enabled: true,
        series: {
          type: 'gantt',
          pointPadding: 0.25,
        },
        yAxis: {
          min: 0,
          max: 2,
          reversed: false,
          categories: [],
        },
      },
      scrollbar: {
        enabled: true,
      },

      chart: { renderTo: this.divReference.nativeElement as HTMLElement },
      xAxis: [
        {
          grid: {
            enabled: true,
          },
          gridLineDashStyle: 'Dot',
          gridLineWidth: 2,
          dateTimeLabelFormats: {
            week: '%e de %b %Y',
            day: '%d',
            month: '%B',
            year: '%Y',
          },
        },

        {
          dateTimeLabelFormats: {
            week: '%e de %b %Y',
            day: '%d',
            month: '%B',
            year: '%Y',
          },
        },
      ],

      yAxis: [
        {
          grid: {
            enabled: true,
          },
          gridLineDashStyle: 'Dot',
          gridLineWidth: 2,
          // staticScale: ,
        },
      ],
      tooltip: {
        dateTimeLabelFormats: {
          week: '%e de %b. %Y',
          day: '%A, %b %e, %Y',
          month: '%B %Y',
          year: '%Y',
        },
      },
      series: [
        {
          name: 'Project 1',
          type: 'gantt',
          data: [
            {
              id: '13f3af68-d552-4c54-bde6-816f474dd4ec/',
              name: 'Jitsi Meet',
              start: Date.UTC(2014, 10, 20),
              end: Date.UTC(2014, 11, 21),
              completed: 1,
            },

            {
              name: 'dsadsa',
              id: '13f3af68-d552-4c54-bde6-816f474dd4ecdsaMeet',
              start: Date.UTC(2014, 10, 20),
              end: Date.UTC(2015, 11, 21),
              parent: '13f3af68-d552-4c54-bde6-816f474dd4ec/',
              completed: 0.3,
            },

            {
              name: 'dsadfdfsa',
              id: '13f3af68-d552-4c54-bde6-816f474dd4ecdsaMeet',
              start: Date.UTC(2014, 10, 20),
              end: Date.UTC(2014, 11, 21),
            },
          ],
        },
      ],
    });
  }
}
