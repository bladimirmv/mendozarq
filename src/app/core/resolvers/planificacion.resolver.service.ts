import { Observable, of } from 'rxjs';
import { PlanificacionProyecto } from '@models/charts/planificacion.interface';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { PlanificacionService } from '@services/mendozarq/planificacion.service';

@Injectable({
  providedIn: 'root',
})
export class PlanificacionResolverService implements Resolve<any> {
  public planificacion: PlanificacionProyecto;

  constructor(private planificacionSvc: PlanificacionService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.planificacionSvc.getOnePlanificacionProyecto(
      route.parent.paramMap.get('uuid')
    );
  }
}
