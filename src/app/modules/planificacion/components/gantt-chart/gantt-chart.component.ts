import { EditPlanificacionProyectoComponent } from './../edit-planificacion-proyecto/edit-planificacion-proyecto.component';
import { EditTareaPlanificacionComponent } from './../edit-tarea-planificacion/edit-tarea-planificacion.component';
import { EditCapituloPlanificacionComponent } from './../edit-capitulo-planificacion/edit-capitulo-planificacion.component';
import { BrightnessService } from '@services/brightness.service';
import { NewCapituloPlanificacionComponent } from './../new-capitulo-planificacion/new-capitulo-planificacion.component';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from '@shared/components/delete-modal/delete-modal.component';
import {
  TareaPlanificacionProyecto,
  CapituloPlanificacionProyecto,
} from '@models/charts/planificacion.interface';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, Subject, forkJoin, pipe } from 'rxjs';
import { NewTareaPlanificacionComponent } from './../new-tarea-planificacion/new-tarea-planificacion.component';
import { PlanificacionProyectoView } from '@models/charts/planificacion.interface';
import { PlanificacionService } from '@services/mendozarq/planificacion.service';
import * as Highcharts from 'highcharts/highcharts-gantt';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

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
  @Input() uuidProyecto: string;

  public canDelete: boolean = false;
  public canEdit: boolean = false;
  public canAddTarea: boolean = false;
  public darkMode: boolean = false;
  public selectedPoints: number = 0;
  public series: any;

  private destroy$: Subject<any> = new Subject<any>();
  private chart: any;
  private planificacionProyecto: PlanificacionProyectoView =
    {} as PlanificacionProyectoView;

  constructor(
    private planificacionSvc: PlanificacionService,
    private matDialog: MatDialog,
    private toastrSvc: ToastrService,
    private brightnessSvc: BrightnessService
  ) {
    this.brightnessSvc.theme$.pipe(take(1)).subscribe((darkTheme: boolean) => {
      this.darkMode = darkTheme;
    });
  }

  ngAfterViewInit() {
    this.initPlanificacionProyecto();
  }
  ngOnInit(): void {}

  public toggleMode(): void {
    this.darkMode = this.darkMode ? false : true;
    this.ganttChartInit();
  }

  public onAddTareaPlanificacion(): void {
    const dialogRef = this.matDialog.open(NewTareaPlanificacionComponent, {
      data: this.planificacionProyecto,
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.initPlanificacionProyecto();
      }
    });
  }

  public onAddCapituloPlanificacion(): void {
    const dialogRef = this.matDialog.open(NewCapituloPlanificacionComponent, {
      data: this.planificacionProyecto,
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.initPlanificacionProyecto();
      }
    });
  }

  public onDeleteCapituloOrTarea(): void {
    const points: any[] = this.chart.getSelectedPoints();
    const dialogRef = this.matDialog.open(DeleteModalComponent);
    let capitulos$: Array<Observable<any>>;
    let tareas$: Array<Observable<any>>;

    capitulos$ = points
      .map((point) => {
        if (!point.parent)
          return this.planificacionSvc.deleteCapituloPlanificacionProyecto(
            point.id
          );
      })
      .filter((cap) => cap !== undefined);

    tareas$ = points
      .map((point) => {
        if (point.parent)
          return this.planificacionSvc.deleteTareaPlanificacionProyecto(
            point.id
          );
      })
      .filter((tar) => tar !== undefined);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (!res) {
          return;
        }
        if (capitulos$) {
          forkJoin(capitulos$).subscribe((res: Array<any>) => {
            console.log('caps', res);
            this.toastrSvc.success(
              'Se ha eliminado correctamente! ',
              `Capítulos Eliminados: ${res.length} 😀`
            );
            this.canDelete = false;
            this.canEdit = false;
            this.selectedPoints = 0;
            this.initPlanificacionProyecto();
          });
        }

        if (tareas$) {
          forkJoin(tareas$).subscribe((res: Array<any>) => {
            console.log('tareas', res);
            this.toastrSvc.success(
              'Se ha eliminado correctamente! ',
              `Tareas Eliminados: ${res.length} 😀`
            );
            this.canDelete = false;
            this.canEdit = false;
            this.selectedPoints = 0;
            this.initPlanificacionProyecto();
          });
        }
      });
  }

  public onEditCapituloOrTarea(): void {
    const points: any = this.chart.getSelectedPoints()[0];
    let capitulo: CapituloPlanificacionProyecto;
    let tarea: TareaPlanificacionProyecto;

    if (!points.parent) {
      capitulo = this.planificacionProyecto.capitulos.filter(
        (tarea) => tarea.uuid === points.id
      )[0];
      const capituloDialogRef = this.matDialog.open(
        EditCapituloPlanificacionComponent,
        {
          data: { capitulo, planificacion: this.planificacionProyecto },
        }
      );

      capituloDialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.canDelete = false;
            this.canEdit = false;
            this.selectedPoints = 0;
            this.initPlanificacionProyecto();
          }
        });

      return;
    }

    tarea = this.planificacionProyecto.tareas.filter(
      (tarea) => tarea.uuid === points.id
    )[0];
    const tareaDialogRef = this.matDialog.open(
      EditTareaPlanificacionComponent,
      {
        data: { tarea, planificacion: this.planificacionProyecto },
      }
    );

    tareaDialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.canDelete = false;
          this.canEdit = false;
          this.selectedPoints = 0;
          this.initPlanificacionProyecto();
        }
      });
  }

  public onEditPlanificacionProyecto(): void {
    const dialogRef = this.matDialog.open(EditPlanificacionProyectoComponent, {
      data: this.planificacionProyecto,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.initPlanificacionProyecto();
          this.canDelete = false;
          this.canEdit = false;
          this.selectedPoints = 0;
        }
      });
  }

  private initPlanificacionProyecto(): void {
    this.planificacionSvc
      .getAllPlanificacionProyectoByUuid(this.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((planificaion: PlanificacionProyectoView) => {
        this.planificacionProyecto = planificaion;
        this.canAddTarea = !!planificaion.capitulos.length;
        this.ganttChartInit();
      });
  }

  private ganttChartInit() {
    Highcharts.setOptions({
      lang: spanish,
      colors: customColors,
      chart: {
        style: {
          fontFamily: 'Montserrat',
          color: '#ff6e00',
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
          style: {
            color: '#ff6e00',
            fontWeight: '900',
            fontSize: '24px',
            cursor: 'pointer',
          },
        },

        subtitle: {
          text: this.planificacionProyecto.subtitulo,
          style: {
            color: this.darkMode ? '#ffffff' : '#000000',
          },
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
                color: '#ff6e00',
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

                  this.selectedPoints = this.chart.getSelectedPoints().length;
                },
                unselect: () => {
                  this.canDelete =
                    this.chart.getSelectedPoints().length > 0 ? true : false;
                  this.canEdit =
                    this.chart.getSelectedPoints().length === 1 ? true : false;

                  this.selectedPoints = this.chart.getSelectedPoints().length;
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
          shadow: true,
          renderTo: this.divReference.nativeElement as HTMLElement,
          spacingLeft: 1,
          borderRadius: 5,
          backgroundColor: this.darkMode ? '#2a2e35' : '#ffffff',
          plotBorderColor: '#ff6e00',
          style: {
            color: '#ff6e00',
            border: '#ff6e00',
          },
        },
        xAxis: [
          {
            labels: {
              style: {
                color: this.darkMode ? '#ffffff' : '#000000',
              },
            },
            grid: {
              enabled: true,
            },
            dateTimeLabelFormats: {
              week: '%e de %b %Y',
              day: '%d',
              month: '%B',
              year: '%Y',
            },
          },

          {
            labels: {
              style: {
                color: this.darkMode ? '#ffffff' : '#000000',
              },
            },
            grid: {
              enabled: true,
            },
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
            labels: {
              style: {
                color: '#ff6e00',
              },
            },
            grid: {
              enabled: true,
            },
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
            name: 'PLANIFICACION PROYECTO',
            type: 'gantt',
            id: 'PLANIFICACION PROYECTO',
            data: this.planificacionProyecto.capitulos
              .map((tarea: CapituloPlanificacionProyecto) => {
                return {
                  id: tarea.uuid,
                  name: tarea.nombre,
                  start: new Date(tarea.fechaInicio).getTime(),
                  end: new Date(tarea.fechaFinal).getTime(),
                  completed: tarea.avance / 100,
                  dependency: tarea.dependencia,
                  color: tarea.color,
                };
              })
              .concat(
                this.planificacionProyecto.tareas.map(
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
                      end: tarea.hito
                        ? 0
                        : new Date(tarea.fechaFinal).getTime(),
                      completed: tarea.avance / 100,
                      dependency: tarea.dependencia,
                      parent: tarea.uuidCapitulo,
                      milestone: tarea.hito ? true : false,
                      color: tarea.color,
                      ...data,
                    };
                  }
                )
              ),
          },
        ],
      }
    );

    this.series = this.chart.series[0];
  }
}
