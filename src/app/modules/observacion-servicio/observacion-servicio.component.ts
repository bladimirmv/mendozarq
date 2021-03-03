import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ServicioProyectoService } from '@services/mendozarq/servicio-proyecto.service';
import { ObservacionServicioService } from '@services/mendozarq/observacion-servicio.service';
import { ServicioProyecto } from '@app/shared/models/mendozarq/servicio.proyecto.interface';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { VisitaProyectoService } from '@app/core/services/mendozarq/visita-proyecto.service';
import { ObservacionServicio } from '@app/shared/models/mendozarq/observacion.servicio.interface';
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
  public servicios: ServicioProyecto[];
  private uuidVisita: string = '';
  public obsrServicio: obsrServicio[];
  // public observaciones$: Observable<ServicioProyecto>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private servicioProyectoSvc: ServicioProyectoService,
    private visitaProyectpSvc: VisitaProyectoService,
    private observacionServicioSvc: ObservacionServicioService

  ) {
    this.uuidVisita = this.activatedRoute.snapshot.parent.parent.params.uuid;
  }

  ngOnInit(): void {
    this.getAllObserbaciones();
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

  // ====================>


  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
