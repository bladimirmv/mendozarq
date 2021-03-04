import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ServicioProyectoService } from '@services/mendozarq/servicio-proyecto.service';
import { ObservacionServicioService } from '@services/mendozarq/observacion-servicio.service';
import { ServicioProyecto } from '@app/shared/models/mendozarq/servicio.proyecto.interface';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { VisitaProyectoService } from '@app/core/services/mendozarq/visita-proyecto.service';
import { ObservacionServicio } from '@app/shared/models/mendozarq/observacion.servicio.interface';
import { VisitaProyecto } from '@app/shared/models/mendozarq/visita.proyecto.interface';
import { MatDialog } from '@angular/material/dialog';
import { NewObservacionServicioComponent } from './components/new-observacion-servicio/new-observacion-servicio.component';

import * as moment from 'moment';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { EditObservacionServicioComponent } from './components/edit-observacion-servicio/edit-observacion-servicio.component';
export interface obsrServicio {
  servicio?: ServicioProyecto,
  observaciones?: ObservacionServicio[]
};
@Component({
  selector: 'app-observacion-servicio',
  templateUrl: './observacion-servicio.component.html',
  styleUrls: ['./observacion-servicio.component.scss']
})
export class ObservacionServicioComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any> = new Subject<any>();
  private uuidVisita: string = '';
  public obsrServicio: obsrServicio[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private observacionServicioSvc: ObservacionServicioService,
    private matDialog: MatDialog,
    private toastrSvc: ToastrService

  ) {
    this.uuidVisita = this.activatedRoute.snapshot.parent.parent.params.uuid;
  }

  ngOnInit(): void {
    this.getAllObserbaciones();
  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ====================> getAllObserbaciones
  public getAllObserbaciones(): void {
    this.observacionServicioSvc
      .getAllObservacionServicio(this.uuidVisita)
      .pipe(takeUntil(this.destroy$))
      .subscribe((obsrServicio: obsrServicio[]) => {
        this.obsrServicio = obsrServicio;
      });
  }

  // ====================> newObservacionServicio
  public newObservacionServicio(servicioProyecto: ServicioProyecto): void {

    const dialogRef = this.matDialog.open(NewObservacionServicioComponent, {
      data: { servicioProyecto: servicioProyecto, uuidVisita: this.uuidVisita }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllObserbaciones();
        }
      });
  }

  // ====================> updateObservacionServicio
  public updateObservacionServicio(observacionServicio: ObservacionServicio): void {

    const dialogRef = this.matDialog
      .open(EditObservacionServicioComponent, {
        data: observacionServicio
      });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllObserbaciones();
        }
      });
  }
  // ====================> deleteObservacionServicio
  public deleteObservacionServicio(observacionServicio: ObservacionServicio): void {
    const dialogRef = this.matDialog.open(DeleteModalComponent);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.observacionServicioSvc
            .deleteObservacionServicio(observacionServicio.uuid)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.toastrSvc.success('Se ha eleiminado correctamente', 'Observacion Eliminado');
              this.getAllObserbaciones();
            });
        }
      });
  }


  public getTime(date: Date): string {
    moment.locale('es');
    return moment(date).format('DD [de] MMMM [de] YYYY');
  }

}
