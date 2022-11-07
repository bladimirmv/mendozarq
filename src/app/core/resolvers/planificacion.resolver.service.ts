import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PlanificacionProyecto } from '@models/charts/planificacion.interface';
import { PlanificacionService } from '@services/mendozarq/planificacion.service';
import { Observable } from 'rxjs';

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
