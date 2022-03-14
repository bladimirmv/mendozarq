import { Observable } from 'rxjs';
import { PlanificacionProyecto } from '@models/charts/planificacion.interface';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { PlanificacionService } from '@services/mendozarq/planificacion.service';

@Injectable({
  providedIn: 'root',
})
export class PlanificacionResolverService
  implements Resolve<PlanificacionProyecto>
{
  constructor(private planificacionSvc: PlanificacionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PlanificacionProyecto> {
    return this.planificacionSvc.getOnePlanificacionProyecto(
      route.parent.paramMap.get('uuid')
    );
  }
}
