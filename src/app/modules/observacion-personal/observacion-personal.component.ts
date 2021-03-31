import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ObservacionesByPersonal, ObservacionPersonal } from '@models/mendozarq/observacion.personal.interface';
import { ToastrService } from 'ngx-toastr';
import { ObservacionPersonalService } from '@services/mendozarq/observacion-personal.service';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import * as moment from 'moment';
import { Personal } from '@app/shared/models/mendozarq/personal.interface';
import { NewObservacionPersonalComponent } from './components/new-observacion-personal/new-observacion-personal.component';
import { EditObservacionPersonalComponent } from './components/edit-observacion-personal/edit-observacion-personal.component';


@Component({
  selector: 'app-observacion-personal',
  templateUrl: './observacion-personal.component.html',
  styleUrls: ['./observacion-personal.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ObservacionPersonalComponent implements OnInit, OnDestroy {

  filterValuePersonal: string;
  dataSource: MatTableDataSource<ObservacionesByPersonal> = new MatTableDataSource();
  columnsToDisplay: Array<string> = ['observaciones', 'activo',
    'nombre', 'apellidoPaterno', 'celular', 'correo', 'sueldo', 'descripcion', 'direccion', 'options'];
  expandedElement: ObservacionesByPersonal | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private destroy$: Subject<any> = new Subject<any>();
  private uuidVisita: string = '';
  public ObservacionesByPersonal: ObservacionesByPersonal[] = [];
  panelOpenState = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private observacionPersonalSvc: ObservacionPersonalService,
    private matDialog: MatDialog,
    private toastrSvc: ToastrService

  ) {
    this.uuidVisita = this.activatedRoute.snapshot.parent.parent.params.uuid;
  }

  ngOnInit(): void {
    this.getAllObservaciones();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ====================> getAllObservaciones
  public getAllObservaciones(): void {
    this.observacionPersonalSvc
      .getAllObservacionPersonal(this.uuidVisita)
      .pipe(takeUntil(this.destroy$))
      .subscribe((ObservacionesByPersonal: ObservacionesByPersonal[]) => {
        this.ObservacionesByPersonal = ObservacionesByPersonal;
        this.dataSource.data = ObservacionesByPersonal;
      });
  }

  toggleFloat(element) {
    element.exapand = element.exapand;
  }
  // ====================> newObservacionPersonal
  public newObservacionPersonal(disabled: boolean, personal?: Personal): void {

    const dialogRef = this.matDialog.open(NewObservacionPersonalComponent, {
      data: {
        uuidVisita: this.uuidVisita,
        disabled,
        personal
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllObservaciones();
        }
      });
  }

  // ====================> updateObservacionPersonal
  public updateObservacionPersonal(observacionPersonal: ObservacionPersonal): void {
    const dialogRef = this.matDialog
      .open(EditObservacionPersonalComponent, {
        data: observacionPersonal
      });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllObservaciones();
        }
      });
  }
  // ====================> deleteObservacionPersonal
  public deleteObservacionPersonal(observacionPersonal: ObservacionPersonal): void {
    const dialogRef = this.matDialog.open(DeleteModalComponent);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.observacionPersonalSvc
            .deleteObservacionPersonal(observacionPersonal.uuid)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.toastrSvc.success('Se ha eleiminado correctamente 😀', 'Observacion Eliminado');
              this.getAllObservaciones();
            });
        }
      });
  }

  public personalObservados(state?: boolean): number {
    let res: number = 0;
    this.ObservacionesByPersonal.forEach(obsr => {
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
