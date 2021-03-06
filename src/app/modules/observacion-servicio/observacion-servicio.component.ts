import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ObservacionServicioService } from '@services/mendozarq/observacion-servicio.service';
import { ServicioProyecto } from '@app/shared/models/mendozarq/servicio.proyecto.interface';
import { ObservacionesByServicio, ObservacionServicio } from '@app/shared/models/mendozarq/observacion.servicio.interface';
import { NewObservacionServicioComponent } from './components/new-observacion-servicio/new-observacion-servicio.component';
import { ToastrService } from 'ngx-toastr';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { EditObservacionServicioComponent } from './components/edit-observacion-servicio/edit-observacion-servicio.component';
import * as moment from 'moment';


@Component({
  selector: 'app-observacion-servicio',
  templateUrl: './observacion-servicio.component.html',
  styleUrls: ['./observacion-servicio.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ObservacionServicioComponent implements OnInit, OnDestroy {
  filterValuePersonal: string;
  dataSource: MatTableDataSource<ObservacionesByServicio> = new MatTableDataSource();
  columnsToDisplay: Array<string> = ['observaciones', 'nombre', 'avance', 'fechaInicio', 'fechaFinal', 'descripcion', 'options'];
  expandedElement: ObservacionesByServicio | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private destroy$: Subject<any> = new Subject<any>();
  private uuidVisita: string = '';
  public ObservacionesByServicio: ObservacionesByServicio[] = [];
  panelOpenState = false;
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

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
      .subscribe((ObservacionesByServicio: ObservacionesByServicio[]) => {
        this.ObservacionesByServicio = ObservacionesByServicio;
        this.dataSource.data = ObservacionesByServicio;
      });
  }

  toggleFloat(element) {
    element.exapand = element.exapand;
  }
  // ====================> newObservacionServicio
  public newObservacionServicio(disabled: boolean, servicioProyecto?: ServicioProyecto): void {

    const dialogRef = this.matDialog.open(NewObservacionServicioComponent, {
      data: {
        uuidVisita: this.uuidVisita,
        disabled,
        sp: servicioProyecto
      }
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

  public serviciosObservados(state?: boolean): number {
    let res: number = 0;
    this.ObservacionesByServicio.forEach(obsr => {
      state
        ? obsr.observaciones.length ? res++ : null
        : !obsr.observaciones.length ? res++ : null;
    });
    return res;
  }

  public getTime(date: Date): string {
    moment.locale('es');
    return moment(date).format('DD [de] MMMM [de] YYYY');
  }

  // =====================> applyFilterPersonal
  applyFilter(event: Event | string): void {
    typeof event === 'string'
      ? this.filterValuePersonal = event
      : this.filterValuePersonal = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValuePersonal.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
