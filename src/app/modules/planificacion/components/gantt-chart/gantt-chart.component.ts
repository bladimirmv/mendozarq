import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from './../../../../shared/components/delete-modal/delete-modal.component';
import { TareaPlanificacionProyecto } from './../../../../shared/models/charts/planificacion.interface';
import { NewTareaPlanificacionComponent } from './../../new-tarea-planificacion/new-tarea-planificacion.component';
import { MatDialog } from '@angular/material/dialog';
import { PlanificacionProyectoView } from '../../../../shared/models/charts/planificacion.interface';
import { filter, takeUntil } from 'rxjs/operators';
import { PlanificacionService } from './../../../../core/services/mendozarq/planificacion.service';
import { PlanificacionProyecto } from '../../../../shared/models/charts/planificacion.interface';
import { observable, Subject } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts-gantt';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

import * as moment from 'moment';

import {
  spanish,
  customColors,
} from '@modules/planificacion/components/gantt-chart/gantt.class';

@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
})
export class GanttChartComponent implements OnInit {
  @ViewChild('divRef', { static: false }) divReference: ElementRef;
  @ViewChild('btnDelete', { static: false }) btnDelete: ElementRef;
  @Input() uuidProyecto: string;

  public canDelete: boolean = false;
  public canEdit: boolean = false;

  private destroy$: Subject<any> = new Subject<any>();
  private chart: any;
  private planificacionProyecto: PlanificacionProyectoView =
    {} as PlanificacionProyectoView;

  series: any;

  constructor(
    private planificacionSvc: PlanificacionService,
    private matDialog: MatDialog,
    private toastrSvc: ToastrService
  ) {}

  ngAfterViewInit() {
    this.initPlanificacionProyecto();
  }
  ngOnInit(): void {
    // this.series = this.chart.series;
    // console.log(this.series);
  }

  public addTareaPlanificacion(): void {
    const dialogRef = this.matDialog.open(NewTareaPlanificacionComponent, {
      data: this.planificacionProyecto,
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.initPlanificacionProyecto();
      }
    });
  }

  public deleteTarea(): void {
    const points: any[] = this.chart.getSelectedPoints();
    const dialogRef = this.matDialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          points.forEach((point: any) => {
            console.log(point);

            this.planificacionSvc
              .deleteTareaPlanificacionProyecto(point.id)
              .subscribe(() => {
                this.toastrSvc.success(
                  'Se ha eliminado correctamente! ',
                  'Planificación Eliminado 😀'
                );

                this.canDelete = false;
                this.canEdit = false;
                this.initPlanificacionProyecto();
              });
          });
        }
      });
  }

  private ganttChartInit() {
    Highcharts.setOptions({
      lang: spanish,
      colors: customColors,
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
          text: this.planificacionProyecto.titulo,
        },

        subtitle: {
          text: this.planificacionProyecto.subtitulo,
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
            data: this.planificacionProyecto.data.map(
              (tarea: TareaPlanificacionProyecto) => {
                let data: any;
                if (tarea.hito) {
                  data = {
                    start: new Date(tarea.fechaInicio).getTime(),
                    end: new Date(tarea.fechaInicio).getTime(),
                    completed: 0,
                  };
                }

                return {
                  id: tarea.uuid,
                  name: tarea.nombre,
                  start: new Date(tarea.fechaInicio).getTime(),
                  end: tarea.hito ? 0 : new Date(tarea.fechaFinal).getTime(),
                  completed: tarea.avance / 100,
                  dependency: tarea.dependencia,
                  parent: tarea.uuidPadre,
                  milestone: tarea.hito ? true : false,
                  color: tarea.color,
                  ...data,
                };
              }
            ),
          },
        ],
      }
    );

    this.series = this.chart.series[0];
  }

  private initPlanificacionProyecto(): void {
    this.planificacionSvc
      .getOnePlanificacionProyecto(this.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((planificaion: PlanificacionProyectoView) => {
        this.planificacionProyecto = planificaion;
        this.ganttChartInit();
      });
  }
}
