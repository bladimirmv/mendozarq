import {
  TareaPlanificacionProyecto,
  PlanificacionProyectoView,
} from './../../../../shared/models/charts/planificacion.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-info-actividades',
  templateUrl: './info-actividades.component.html',
  styleUrls: ['./info-actividades.component.scss'],
})
export class InfoActividadesComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tarea: TareaPlanificacionProyecto;
      planificacion: PlanificacionProyectoView;
    }
  ) {}

  ngOnInit(): void {}
}
