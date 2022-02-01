import { PlanificacionProyecto } from '../../../../shared/models/charts/planificacion.models';
import { observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts-gantt';

import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
})
export class GanttChartComponent implements OnInit {
  @ViewChild('divRef', { static: false }) divReference: ElementRef;
  @ViewChild('btnDelete', { static: false }) btnDelete: ElementRef;

  chart: any;
  // private reduce: any;
  private each: any;

  public canDelete: boolean = false;
  public canEdit: boolean = false;

  private planificacionProyecto: PlanificacionProyecto =
    {} as PlanificacionProyecto;
  data: any[] = [
    {
      id: '13f3af68-d552-4c54-bde6-816f474dd4ec/',
      name: 'Jitsi Meet',
      start: Date.UTC(2014, 11, 21),
      end: Date.UTC(2014, 11, 23),
      completed: 0.3,
    },

    {
      name: 'Nihil recusandae.',
      id: 'dsadasd',
      start: Date.UTC(2015, 0, 1),
      end: Date.UTC(2015, 4, 1),
      parent: '13f3af68-d552-4c54-bde6-816f474dd4ec/',
      milestone: true,
      dependency: '13f3af68-d552-4c54-bde6-816f474dd4ec/',
    },
  ];

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
  };
  series: any;

  constructor() {}

  ngAfterViewInit() {
    this.ganttChartInit();
  }
  ngOnInit(): void {
    // this.series = this.chart.series;
    // console.log(this.series);

    console.log(Date.UTC(2014, 10, 19));
  }

  ganttChartInit() {
    Highcharts.setOptions({
      lang: this.spanish,
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
        },
      },
      credits: {
        enabled: false,
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

    this.chart = Highcharts.ganttChart(
      this.divReference.nativeElement as HTMLElement,
      {
        title: {
          text: 'Planificación del Proyecto',
        },

        subtitle: {
          text: 'Consequatur molestias aut. Sit voluptates laborum porro neque repudiandae aut. Et sit iusto veritatis nihil. Laborum quae corporis accusantium ut dolorum. Repellendus rem temporibus aut possimus perspiciatis sit consequatur. Nisi corrupti at voluptatem.',
        },

        plotOptions: {
          gantt: {
            states: {
              select: {
                color: '#ffffff',
                borderColor: '#ff6e00',
                animation: false,
                enabled: true,
                borderWidth: 3,
              },
            },
          },
          series: {
            animation: false,
            dataLabels: {
              style: {
                cursor: 'pointer',
                color: '#ffffff',
              },
            },
            allowPointSelect: true,
            point: {
              events: {
                select: () => {
                  this.canDelete =
                    this.chart.getSelectedPoints().length > 0 ? true : false;
                  this.canEdit =
                    this.chart.getSelectedPoints().length === 1 ? true : false;
                },
                unselect: () => {
                  this.canDelete =
                    this.chart.getSelectedPoints().length > 0 ? true : false;
                  this.canEdit =
                    this.chart.getSelectedPoints().length === 1 ? true : false;
                },
              },
            },
          },
        },

        exporting: {
          enabled: true,
        },
        navigator: {
          enabled: true,
          series: {
            type: 'gantt',
            pointPadding: 0.25,
          },
          yAxis: {
            min: 0,
            max: 3,
            reversed: false,
            categories: [],
          },
        },
        scrollbar: {
          enabled: true,
        },
        chart: {
          renderTo: this.divReference.nativeElement as HTMLElement,
          spacingLeft: 1,
        },
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
            name: 'Project 1s',
            type: 'gantt',
            id: 'dd',
            data: this.data,
          },
        ],
      }
    );

    this.each = Highcharts.each;
    this.series = this.chart.series[0];
  }

  public deleteTarea(): void {
    const points: any[] = this.chart.getSelectedPoints();
    points.forEach((point: any) => {});

    this.canDelete = false;
    this.canEdit = false;
    this.ganttChartInit();
  }
}
