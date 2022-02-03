import { NewPlanificacionProyectoComponent } from './new-planificacion-proyecto/new-planificacion-proyecto.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PlanificacionProyectoView } from '@app/shared/models/charts/planificacion.interface';
import { PlanificacionService } from '@services/mendozarq/planificacion.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-planificacion',
  templateUrl: './planificacion.component.html',
  styleUrls: ['./planificacion.component.scss'],
})
export class PlanificacionComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private destroy$: Subject<any> = new Subject<any>();
  public planificacionProyecto: PlanificacionProyectoView | null =
    {} as PlanificacionProyectoView;

  public uuidProyecto: string;
  public isNewPlanificacion: boolean = false;
  public showChart: boolean = false;

  constructor(
    private planificacionSvc: PlanificacionService,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.uuidProyecto = this.activatedRoute.snapshot.parent.parent.params.uuid;
    this.initPlanificacionProyecto();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initPlanificacionProyecto(): void {
    this.planificacionSvc
      .getOnePlanificacionProyecto(this.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((planificaion: PlanificacionProyectoView) => {
        this.planificacionProyecto = planificaion;
        this.showChart = true;

        if (!planificaion) {
          this.showChart = false;
          this.isNewPlanificacion = true;
          return;
        }
      });
  }

  public newPlanificacionProyecto(): void {
    const dialogRef = this.matDialog.open(NewPlanificacionProyectoComponent, {
      data: this.uuidProyecto,
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.isNewPlanificacion = false;
        this.showChart = true;
      }
    });
  }
}
