import { take } from 'rxjs/operators';
import { PresupuestosService } from '@services/mendozarq/presupuestos.service';
import { PresupuestoObra } from '@models/mendozarq/presupuestos.interface';
import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresupuestoPoryectoResolverService
  implements Resolve<PresupuestoObra>
{
  constructor(private presupuestosSvc: PresupuestosService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.presupuestosSvc.getOnePresupuestoObraProyecto(
      route.parent.paramMap.get('uuid')
    );
  }
}
