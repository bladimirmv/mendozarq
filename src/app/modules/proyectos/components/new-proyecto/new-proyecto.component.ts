import { ClienteModalComponent } from './../cliente-modal/cliente-modal.component';
import { UsuarioService } from '@services/auth/usuario.service';
import { CategoriaProyectoService } from '@services/mendozarq/categoria-proyecto.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Usuario } from '@app/shared/models/usuario.interface';
import { Observable, Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { ProyectoService } from '@services/mendozarq/proyecto.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Proyecto } from '@app/shared/models/mendozarq/proyecto.interface';
import { CategoriaProyecto } from '@app/shared/models/mendozarq/categoria.proyecto.interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Router } from '@angular/router';

@Component({
  selector: 'app-new-proyecto',
  templateUrl: './new-proyecto.component.html',
  styleUrls: ['./new-proyecto.component.scss']
})
export class NewProyectoComponent implements OnInit {
  private destroy$ = new Subject<any>();

  public proyectoForm: FormGroup;
  private clientes: Usuario[] = [];
  public selectedClientes: Usuario[] = [];

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<Usuario[]>;

  constructor(
    private proyectoSvc: ProyectoService,
    private toastrSvc: ToastrService,
    private usuarioSvc: UsuarioService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private catProyecto: CategoriaProyectoService,
    private dialogRef: MatDialogRef<NewProyectoComponent>) { }


  ngOnInit(): void {
    this.initForm();

    this.usuarioSvc.getAllUsuarios()
      .pipe(map((usuarios: Usuario[]) =>
        usuarios.filter((usuario: Usuario) => usuario.rol === 'cliente')
      ))
      .subscribe((clientes: Usuario[]) => {
        if (!clientes.length) {

          const dialogRef = this.dialog.open(ClienteModalComponent);

          dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
              if (res) {
                dialogRef.close();
                this.dialogRef.close(this.proyectoForm);

                this.router.navigate(['admin/usuarios']);
              } else {
                dialogRef.close();
                this.dialogRef.close(this.proyectoForm);

              }
            });
        }
        this.selectedClientes = clientes;
        this.clientes = clientes;
      });
  }



  public onKey(value) {
    this.selectedClientes = this._filter(value);
  }


  private _filter(value: string): Usuario[] {
    const filterValue = value.toLowerCase();

    return this.clientes.filter(cliente => {
      return cliente.nombre.toLowerCase().indexOf(filterValue) === 0
        || cliente.apellidoPaterno.toLowerCase().indexOf(filterValue) === 0
        || cliente.apellidoMaterno.toLowerCase().indexOf(filterValue) === 0;
    })
  }


  // ============> onInitForm
  private initForm(): void {
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[0-9a-z\s]+$/)]],
      descripcion: ['', Validators.maxLength(200)],
      estado: [true, Validators.required],
      fechaInicio: [Validators.required],
      fechaFinal: [Validators.required],
      lugarProyecto: ['', Validators.maxLength(200)],
      uuidCliente: ['', Validators.required],
      categoria: ['', Validators.required]
    });

  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.proyectoForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }


  // ===================> onAddProyecto
  public onAddProyecto(proyecto: Proyecto): void {
    console.log('proy', proyecto);

    // this.proyectoSvc.addProyecto(proyecto)
    //   .subscribe(usr => {
    //     if (usr) {
    //       this.toastrSvc.success('El proyecto se ha creado correctamente. 😀', 'Proyecto Creado');
    //       this.dialogRef.close(this.proyectoForm);
    //     }

    //   });

  }

  // // ===========> isValidField
  // public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
  //   const validateFIeld = this.proyectoForm.get(field);
  //   return (!validateFIeld.valid && validateFIeld.touched)
  //     ? { color: 'warn', status: false, icon: 'close' }
  //     : validateFIeld.valid
  //       ? { color: 'accent', status: true, icon: 'done' }
  //       : {};
  // }

  // // ===========> getString
  // getString(num: number): string {
  //   return String(num);
  // }


}
