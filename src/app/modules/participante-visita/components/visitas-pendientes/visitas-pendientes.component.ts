import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParticipanteVisitaService } from '@app/core/services/mendozarq/participante-visita.service';
import { VisitasPendientes } from '@app/shared/models/mendozarq/participante.visita.interface';
import { Usuario } from '@app/shared/models/usuario.interface';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-visitas-pendientes',
  templateUrl: './visitas-pendientes.component.html',
  styleUrls: ['./visitas-pendientes.component.scss']
})
export class VisitasPendientesComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any> = new Subject<any>();
  public visitas: VisitasPendientes[] = [];
  public panelOpenState = false;
  constructor(
    private participanteVisitaSvc: ParticipanteVisitaService,
    @Inject(MAT_DIALOG_DATA) private usuario: Usuario
  ) { }

  ngOnInit(): void {
    moment.locale('es');
    this.getAllVisitasPendientes();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ====================> getAllVisitasPendientes
  private getAllVisitasPendientes(): void {
    this.participanteVisitaSvc
      .getAllVisitasPendientesByUsuario(this.usuario.uuid)
      .pipe(takeUntil(this.destroy$),
        map(a => a.map(data => {
          data.fecha = moment(data.fecha).format('DD [de] MMMM [del] YYYY, hh:mm a');
          return data;
        })))
      .subscribe((visitas: VisitasPendientes[]) => {
        this.visitas = visitas;
      });
  }

}
