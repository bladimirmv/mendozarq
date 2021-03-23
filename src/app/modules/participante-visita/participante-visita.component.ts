import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { SelectionModel } from '@angular/cdk/collections';
import { ParticipanteVisitaService } from '@services/mendozarq/participante-visita.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';

import { MatPaginator } from '@angular/material/paginator';
import { UsuarioVisita } from '@app/shared/models/mendozarq/participante.visita.interface';
import { NewUsuarioVisitaComponent } from './components/new-usuario-visita/new-usuario-visita.component';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { Roles, Usuario } from '@app/shared/models/usuario.interface';

@Component({
  selector: 'app-participante-visita',
  templateUrl: './participante-visita.component.html',
  styleUrls: ['./participante-visita.component.scss']
})
export class ParticipanteVisitaComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();
  private uuidVisita: string = '';
  public usuarios: Usuario[] = [];


  selectedUsuario: UsuarioVisita[] = [];
  selectionUsuario = new SelectionModel<UsuarioVisita>(true, []);
  @ViewChild(MatSort, { static: true }) sortUsuario: MatSort;
  @ViewChild('usuarioPaginator', { read: MatPaginator, static: true }) usuarioPaginator: MatPaginator;
  filterValueUsuario: string;
  public usuariosColumns: Array<string> = ['seleccion', 'estado', 'nombre', 'apellidos', 'rol', 'celular',
    'username', 'correo', 'direccion'];
  public usuarioSource: MatTableDataSource<UsuarioVisita> = new MatTableDataSource();

  constructor(
    private activatedRoute: ActivatedRoute,
    private participanteVisitaSvc: ParticipanteVisitaService,
    private dialog: MatDialog,
    private toastrSvc: ToastrService) {
  }

  ngOnInit(): void {
    this.uuidVisita = this.activatedRoute.snapshot.parent.parent.params.uuid;

    this.getAllUsuarioVisita();
    this.usuarioSource.paginator = this.usuarioPaginator;
    this.usuarioSource.sort = this.sortUsuario;
    this.selectionUsuario.changed
      .pipe(takeUntil(this.destroy$),
        map(a => a.source))
      .subscribe(data => this.selectedUsuario = data.selected);
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }


  // =====================> getAllUsuarioVisita
  private getAllUsuarioVisita(): void {
    this.participanteVisitaSvc
      .getAllParticipanteVisita(this.uuidVisita)
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuarioVisita: UsuarioVisita[]) => {
        this.usuarioSource.data = usuarioVisita;
        this.usuarios = usuarioVisita;
      })
  }

  // ====================> newUsuario
  public newUsuario(): void {
    const dialogRef = this.dialog.open(NewUsuarioVisitaComponent, {
      data: this.uuidVisita
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllUsuarioVisita();
        }
      });
  }

  // =====================> deleteUsuario
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
    this.participanteVisitaSvc
      .deleteParticipanteVisita(this.selectedUsuario[0].uuidParticipanteVisita)
      .pipe(takeUntil(this.destroy$))
      .subscribe(usr => {
        if (usr) {
          this.toastrSvc.success('Se ha eliminado correctamente', 'Usuario Eliminado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.getAllUsuarioVisita();
          this.clearCheckboxUsuario();
        }
      });
  }

  // =====================> deleteMoreThanOneUsuario
  private deleteMoreThanOneUsuario(): void {
    this.selectedUsuario.forEach((usuario, index) => {
      const isLast: boolean = index + 1 === this.selectedUsuario.length;
      this.participanteVisitaSvc
        .deleteParticipanteVisita(usuario.uuidParticipanteVisita)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res && isLast) {
            this.toastrSvc.success('Se han eliminado correctamente', 'Usuarios Eliminado', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.getAllUsuarioVisita()
            this.clearCheckboxUsuario();
          }
        });

    });
  }


  public typeUser(users: Usuario[], type: Roles): number {
    let cant = 0;
    users.forEach((user) => user.rol === type ? cant++ : false);
    return cant;
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
  checkboxLabelUsuario(row?: UsuarioVisita): string {
    if (!row) {
      return `${this.isAllSelectedUsuario() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionUsuario.isSelected(row) ? 'deselect' : 'select'} row ${row.uuid}`;
  }

}
