import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Personal } from '@app/shared/models/mendozarq/personal.interface';
import { Usuario } from '@app/shared/models/usuario.interface';
import { ParticipantesProyectoService } from '@services/mendozarq/participantes-proyecto.service';
import { Subject } from 'rxjs';
import { map, takeUntil, takeWhile } from 'rxjs/operators';

import { PersonalProyecto, UsuarioProyecto } from '@app/shared/models/mendozarq/participante.proyecto.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';

import { NewPersonalProyectoComponent } from './components/new-personal-proyecto/new-personal-proyecto.component';
import { NewUsuarioProyectoComponent } from './components/new-usuario-proyecto/new-usuario-proyecto.component';
import { MatPaginator } from '@angular/material/paginator';



export interface PersonalParticipante extends Personal {
  uuidPersonalProyecto?: string
}
export interface UsuarioParticipante extends Usuario {
  uuidUsuarioProyecto?: string
}

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.scss']
})
export class ParticipantesComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any> = new Subject<any>();
  private uuidProyecto: string = '';


  selectedUsuario: UsuarioParticipante[] = [];
  selectionUsuario = new SelectionModel<UsuarioParticipante>(true, []);
  @ViewChild(MatSort, { static: true }) sortUsuario: MatSort;
  @ViewChild('usuarioPaginator', { read: MatPaginator, static: true }) usuarioPaginator: MatPaginator;
  filterValueUsuario: string;
  public usuariosColumns: Array<string> = ['seleccion', 'estado', 'nombre', 'apellidos', 'rol', 'celular',
    'username', 'correo', 'direccion'];
  public usuarioSource: MatTableDataSource<UsuarioParticipante> = new MatTableDataSource();


  selectedPersonal: PersonalParticipante[] = [];
  selectionPersonal = new SelectionModel<PersonalParticipante>(true, []);
  @ViewChild(MatSort, { static: true }) sortPersonal: MatSort;
  @ViewChild('personalPaginator', { read: MatPaginator, static: true }) personalPaginator: MatPaginator;
  filterValuePersonal: string;
  public personalColumns: Array<string> = ['seleccion', 'estado', 'nombre', 'apellidos', 'celular', 'correo',
    'descripcion', 'direccion'];
  public personalSource: MatTableDataSource<PersonalParticipante> = new MatTableDataSource();

  constructor(
    private activatedRoute: ActivatedRoute,
    private participantesSvc: ParticipantesProyectoService,
    private dialog: MatDialog,
    private toastrSvc: ToastrService
  ) { }

  ngOnInit(): void {
    this.uuidProyecto = this.activatedRoute.snapshot.parent.parent.params.uuid;

    this.getAllUsuarioProyecto();
    this.getAllPersonalProyecto();

    this.usuarioSource.paginator = this.usuarioPaginator;
    this.usuarioSource.sort = this.sortUsuario;
    this.selectionUsuario.changed
      .pipe(takeUntil(this.destroy$),
        map(a => a.source))
      .subscribe(data => this.selectedUsuario = data.selected);

    this.personalSource.paginator = this.personalPaginator;
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


  // =====================> getAllUsuarioProyecto
  private getAllUsuarioProyecto(): void {
    this.participantesSvc
      .getAllUsuarioProyecto(this.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario: Usuario[]) => {
        this.usuarioSource.data = usuario;
      })
  }

  public newUsuario(): void {
    const usuarioProyecto: UsuarioProyecto = {
      uuidProyecto: this.uuidProyecto
    };
    const dialogRef = this.dialog.open(NewUsuarioProyectoComponent, {
      minWidth: '400px',
      data: usuarioProyecto
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllUsuarioProyecto();
        }
      });
  }
  public deleteUsuario(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.selectedUsuario.length === 1
            ? this.deleteOneUsuario()
            : this.deleteMoreThanOneUsuario();
        }
      });
  }

  // =====================> deleteOneUsuario
  private deleteOneUsuario(): void {
    this.participantesSvc
      .deleteUsuarioProyecto(this.selectedUsuario[0].uuidUsuarioProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe(usr => {
        if (usr) {
          this.toastrSvc.success('Se ha eliminado correctamente', 'Usuario Eliminado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.getAllUsuarioProyecto();
          this.clearCheckboxUsuario();
        }
      });
  }

  // =====================> deleteMoreThanOneUsuario
  private deleteMoreThanOneUsuario(): void {
    this.selectedUsuario.forEach((usuario, index) => {
      const isLast: boolean = index + 1 === this.selectedUsuario.length;
      this.participantesSvc
        .deleteUsuarioProyecto(usuario.uuidUsuarioProyecto)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.toastrSvc.success('Se han eliminado correctamente', 'Usuarios Eliminado', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.getAllUsuarioProyecto()
            this.clearCheckboxUsuario();
          }
        });

    });
  }


  // !important, this part is for usuarioProyecto table.
  // =====================> applyFilterUsuario
  applyFilterUsuario(event: Event | string): void {
    typeof event === 'string'
      ? this.filterValueUsuario = event
      : this.filterValueUsuario = (event.target as HTMLInputElement).value;

    this.usuarioSource.filter = this.filterValueUsuario.trim().toLowerCase();
    if (this.usuarioSource.paginator) {
      this.usuarioSource.paginator.firstPage();
    }
  }
  // =====================> isAllSelectedUsuario
  isAllSelectedUsuario(): any {
    const numSelected = this.selectionUsuario.selected.length;
    const numRows = this.usuarioSource.data.length;
    return numSelected === numRows;
  }
  // =====================> masterToggleUsuario
  masterToggleUsuario(): void {
    this.isAllSelectedUsuario() ?
      this.selectionUsuario.clear() :
      this.usuarioSource.data.forEach(row => this.selectionUsuario.select(row));
  }
  // =====================> clearCheckboxUsuario
  clearCheckboxUsuario(): void {
    this.selectionUsuario.clear();
  }
  // =====================> checkboxLabelUsuario
  checkboxLabelUsuario(row?: Usuario): string {
    if (!row) {
      return `${this.isAllSelectedUsuario() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionUsuario.isSelected(row) ? 'deselect' : 'select'} row ${row.uuid}`;
  }



  // ****************************** PersonalProyecto ********************************************
  // =====================> getAllPersonalProyecto
  private getAllPersonalProyecto(): void {
    this.participantesSvc
      .getAllPersonalProyecto(this.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((personal: PersonalParticipante[]) => {
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
      .deletePersonalProyecto(this.selectedPersonal[0].uuidPersonalProyecto)
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
        .deletePersonalProyecto(personal.uuidPersonalProyecto)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
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

  // !important, this part is for personalProyecto table.
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
