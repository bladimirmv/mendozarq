import { NewPlanificacionProyectoComponent } from './components/new-planificacion-proyecto/new-planificacion-proyecto.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { PlanificacionProyecto } from '@app/shared/models/charts/planificacion.interface';
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
  public planificacionProyecto: PlanificacionProyecto | null =
    {} as PlanificacionProyecto;

  public uuidProyecto: string;
  public showChart: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.uuidProyecto = this.activatedRoute.snapshot.parent.parent.params.uuid;

    this.planificacionProyecto =
      this.activatedRoute.snapshot.data['planificacion'];
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  public newPlanificacionProyecto(): void {
    const dialogRef = this.matDialog.open(NewPlanificacionProyectoComponent, {
      data: this.uuidProyecto,
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.showChart = true;
      }
    });
  }
}
