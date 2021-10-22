import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Observable, observable, Subject } from 'rxjs';
import { VisitaProyecto } from '@models/mendozarq/visita.proyecto.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VisitaProyectoService } from '@services/mendozarq/visita-proyecto.service';
import { map, observeOn, takeUntil, timeout } from 'rxjs/operators';
import { NewVisitaProyectoComponent } from './components/new-visita-proyecto/new-visita-proyecto.component';
import { EditVisitaProyectoComponent } from './components/edit-visita-proyecto/edit-visita-proyecto.component';

import * as moment from 'moment';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.scss']
})
export class VisitasComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();
  private uuidProyecto: string;
  public visitas: VisitaProyecto[] = [];

  selected: VisitaProyecto[] = [];
  selection = new SelectionModel<VisitaProyecto>(true, []);
  filterValue: string;
  public columns: Array<string> = ['seleccion', 'estado', 'nombre', 'fecha', 'faseDelProyecto', 'descripcion', 'edit'];
  public source: MatTableDataSource<VisitaProyecto> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private visitaProyectoSvc: VisitaProyectoService,
    private dialog: MatDialog,
    private toastrSvc: ToastrService

  ) { }
  ngOnInit(): void {
    this.uuidProyecto = this.activatedRoute.snapshot.parent.parent.params.uuid;
    this.getAllVisitaProyecto();

    this.source.paginator = this.paginator;
    this.source.sort = this.sort;

    this.selection.changed
      .pipe(map(a => a.source), takeUntil(this.destroy$))
      .subscribe(data => this.selected = data.selected);
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }


  // =====================> getAllVisitaProyecto
  private getAllVisitaProyecto(): void {
    this.visitaProyectoSvc
      .getAllVisitaProyecto(this.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((visitas: VisitaProyecto[]) => {
        this.source.data = visitas;
        this.visitas = visitas;
      })
  }
  // =====================> newPersonal
  public newServicio(): void {
    const visitaProyecto: VisitaProyecto = {
      uuidProyecto: this.uuidProyecto
    };
    const dialogRef = this.dialog.open(NewVisitaProyectoComponent, {
      data: visitaProyecto
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllVisitaProyecto();
        }
      });
  }
  // =====================> deletePersonal
  public deleteVisita() {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOneVisita()
            : this.deleteMoreThanOneVisita();
        }
      });
  }
  // =====================> deleteOnePersonal
  private deleteOneVisita(): void {
    this.visitaProyectoSvc
      .deleteVisitaProyecto(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('Se ha eliminado correctamente', 'Visita Eliminado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.getAllVisitaProyecto();
          this.clearCheckbox();
        }
      });
  }

  // =====================> deleteMoreThanOnePersonal
  private deleteMoreThanOneVisita(): void {
    this.selected.forEach((visita, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.visitaProyectoSvc
        .deleteVisitaProyecto(visita.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.toastrSvc.success('Se han eliminado correctamente', 'Visitas Eliminado', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.getAllVisitaProyecto()
            this.clearCheckbox();
          }
        });

    });
  }

  // =====================> updateServicio
  public updateServicio(visitaProyecto: VisitaProyecto): void {
    const dialogRef = this.dialog.open(EditVisitaProyectoComponent, { data: visitaProyecto });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllVisitaProyecto();
        }
      });
  }


  getDateString(date: Date): string {
    moment.locale('es');
    const result = moment(date).format('DD [de] MMMM [de] YYYY, h:mm:ss a');
    return result;
  }

  compareDate(date: Date): boolean {
    return moment(date) > moment() ? true : false;
  }

  // realtime(date: Date): Observable<boolean> {
  //   return new Observable<boolean>((observer) => {
  //     setInterval(() => {
  //       if (moment(date) > moment()) {
  //         observer.next(true);
  //       } else {
  //         observer.next(false);
  //         observer.complete();
  //       }
  //     }, 1000 * 60);
  //   });
  // }




  // !important, this part is for servicioProyecto table.
  // =====================> applyFilter
  applyFilter(event: Event | string): void {
    typeof event === 'string'
      ? this.filterValue = event
      : this.filterValue = (event.target as HTMLInputElement).value;

    this.source.filter = this.filterValue.trim().toLowerCase();
    if (this.source.paginator) {
      this.source.paginator.firstPage();
    }
  }
  // =====================> isAllSelected
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.source.data.length;
    return numSelected === numRows;
  }
  // =====================> masterToggle
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.source.data.forEach(row => this.selection.select(row));
  }
  // =====================> clearCheckbox
  clearCheckbox(): void {
    this.selection.clear();
  }
  // =====================> checkboxLabel
  checkboxLabel(row?: VisitaProyecto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.uuid}`;
  }

}
