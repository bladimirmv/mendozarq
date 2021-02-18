import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Personal } from '@app/shared/models/mendozarq/personal.interface';
import { Usuario } from '@app/shared/models/usuario.interface';
import { ParticipantesProyectoService } from '@services/mendozarq/participantes-proyecto.service';
import { Subject } from 'rxjs';
import { map, takeUntil, takeWhile } from 'rxjs/operators';
import { NewPersonalProyectoComponent } from './components/new-personal-proyecto/new-personal-proyecto.component';

import { PersonalProyecto } from '@app/shared/models/mendozarq/participante.proyecto.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.scss']
})
export class ParticipantesComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any> = new Subject<any>();
  private uuidProyecto: string = '';

  selectedPersonal: Personal[] = [];
  selectionPersonal = new SelectionModel<Personal>(true, []);
  @ViewChild(MatSort, { static: true }) sortPersonal: MatSort;
  filterValuePersonal: string;
  public personalColumns: Array<string> = ['seleccion', 'estado', 'nombre', 'apellidos', 'celular', 'correo', 'descripcion', 'direccion'];
  public personalSource: MatTableDataSource<Personal> = new MatTableDataSource();







  public usuariosColumns: Array<string> = ['estado', 'nombre', 'apellidos', 'rol', 'celular', 'username', 'correo', 'descripcion', 'direccion', 'delete'];
  public usuariosSource: Usuario[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private participantesSvc: ParticipantesProyectoService,
    private dialog: MatDialog,
    private toastrSvc: ToastrService
  ) { }

  ngOnInit(): void {
    this.uuidProyecto = this.activatedRoute.snapshot.parent.parent.params.uuid;
    this.getAllPersonalProyecto();

    this.personalSource.sort = this.sortPersonal;
    this.selectionPersonal.changed
      .pipe(takeUntil(this.destroy$),
        map(a => a.source))
      .subscribe(data => this.selectedPersonal = data.selected);
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }


  // =====================> getAllPersonalProyecto
  private getAllPersonalProyecto(): void {
    this.participantesSvc
      .getAllPersonalProyecto(this.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((personal: Personal[]) => {
        this.personalSource.data = personal;
      })
  }
  // =====================> newPersonal
  public newPersonal(): void {
    const personalProyecto: PersonalProyecto = {
      uuidProyecto: this.uuidProyecto
    };
    const dialogRef = this.dialog.open(NewPersonalProyectoComponent, {
      minWidth: '400px',
      data: personalProyecto
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllPersonalProyecto();
        }
      });
  }
  // =====================> deletePersonal
  public deletePersonal() {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.selectedPersonal.length === 1
            ? this.deleteOnePersonal()
            : this.deleteMoreThanOnePersonal();
        }
      });
  }
  // =====================> deleteOnePersonal
  private deleteOnePersonal(): void {
    this.participantesSvc
      .deletePersonalProyecto(this.selectedPersonal[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(usr => {
        if (usr) {
          this.toastrSvc.success('Se ha eliminado correctamente', 'Personal Eliminado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.getAllPersonalProyecto();
          this.clearCheckboxPersonal();
        }
      });
  }

  // =====================> deleteMoreThanOnePersonal
  private deleteMoreThanOnePersonal(): void {
    this.selectedPersonal.forEach((personal, index) => {
      const isLast: boolean = index + 1 === this.selectedPersonal.length;
      this.participantesSvc
        .deletePersonalProyecto(personal.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res && isLast) {
            this.toastrSvc.success('Se han eliminado correctamente', 'Personal Eliminado', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.getAllPersonalProyecto()
            this.clearCheckboxPersonal();
          }
        });

    });
  }



  // !important, this part is for table.
  // =====================> applyFilterPersonal
  applyFilterPersonal(event: Event | string): void {
    typeof event === 'string'
      ? this.filterValuePersonal = event
      : this.filterValuePersonal = (event.target as HTMLInputElement).value;

    this.personalSource.filter = this.filterValuePersonal.trim().toLowerCase();
    if (this.personalSource.paginator) {
      this.personalSource.paginator.firstPage();
    }
  }
  // =====================> isAllSelectedPersonal
  isAllSelectedPersonal(): any {
    const numSelected = this.selectionPersonal.selected.length;
    const numRows = this.personalSource.data.length;
    return numSelected === numRows;
  }
  // =====================> masterTogglePersonal
  masterTogglePersonal(): void {
    this.isAllSelectedPersonal() ?
      this.selectionPersonal.clear() :
      this.personalSource.data.forEach(row => this.selectionPersonal.select(row));
  }
  // =====================> clearCheckboxPersonal
  clearCheckboxPersonal(): void {
    this.selectionPersonal.clear();
  }
  // =====================> checkboxLabelPersonal
  checkboxLabelPersonal(row?: Personal): string {
    if (!row) {
      return `${this.isAllSelectedPersonal() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionPersonal.isSelected(row) ? 'deselect' : 'select'} row ${row.uuid}`;
  }
}
