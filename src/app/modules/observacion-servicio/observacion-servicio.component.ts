import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ServicioProyectoService } from '@services/mendozarq/servicio-proyecto.service';
import { ObservacionServicioService } from '@services/mendozarq/observacion-servicio.service';
import { ServicioProyecto } from '@app/shared/models/mendozarq/servicio.proyecto.interface';

@Component({
  selector: 'app-observacion-servicio',
  templateUrl: './observacion-servicio.component.html',
  styleUrls: ['./observacion-servicio.component.scss']
})
export class ObservacionServicioComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any> = new Subject<any>();
  public servicios$: Observable<ServicioProyecto>;
  // public observaciones$: Observable<ServicioProyecto>;

  constructor(
    private servicioProyectoSvc: ServicioProyectoService,
    private observacionServicioSvc: ObservacionServicioService
  ) { }

  ngOnInit(): void {
  }

  private getAllServicios(): void {






    // this.servicioProyectoSvc.getAllServicioProyecto()
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
