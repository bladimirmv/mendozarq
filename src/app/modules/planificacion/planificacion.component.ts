import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject, pipe } from 'rxjs';
import { PlanificacionProyectoView } from '@models/charts/planificacion.models';
import { PlanificacionService } from '@services/mendozarq/planificacion.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-planificacion',
  templateUrl: './planificacion.component.html',
  styleUrls: ['./planificacion.component.scss'],
})
export class PlanificacionComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();
  public planificacionProyecto: PlanificacionProyectoView =
    {} as PlanificacionProyectoView;

  private uuidProyecto: string;

  constructor(
    private planificacionSvc: PlanificacionService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.uuidProyecto = this.activatedRoute.snapshot.parent.parent.params.uuid;
    console.log(this.uuidProyecto);

    this.initPlanificacionProyecto();
  }

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
      });
  }
}
