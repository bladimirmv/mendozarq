import { UsuarioService } from '@services/auth/usuario.service';
import { CategoriaProyectoService } from '@services/mendozarq/categoria-proyecto.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Usuario } from '@app/shared/models/usuario.interface';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { ProyectoService } from '@services/mendozarq/proyecto.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Proyecto } from '@app/shared/models/mendozarq/proyecto.interface';
import { CategoriaProyecto } from '@app/shared/models/mendozarq/categoria.proyecto.interface';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-proyecto',
  templateUrl: './new-proyecto.component.html',
  styleUrls: ['./new-proyecto.component.scss']
})
export class NewProyectoComponent implements OnInit {

  public $clientes: Observable<Usuario[]>;
  public proyectoForm: FormGroup;
  public clientes: Usuario[] = [];

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<Usuario[]>;

  constructor(
    private proyectoSvc: ProyectoService,
    private toastrSvc: ToastrService,
    private usuarioSvc: UsuarioService,
    private fb: FormBuilder,
    private catProyecto: CategoriaProyectoService,
    private dialogRef: MatDialogRef<NewProyectoComponent>) { }


  ngOnInit(): void {
    this.initForm();

    this.usuarioSvc.getAllUsuarios()
      .pipe(map((usuarios: Usuario[]) =>
        usuarios.filter((usuario: Usuario) => usuario.rol === 'cliente')
      ))
      .subscribe((clientes: Usuario[]) => {
        this.clientes = clientes;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      });


  }


  private _filter(value: string): Usuario[] {
    const filterValue = value.toLowerCase();

    return this.clientes.filter(cliente => {

      return cliente.nombre.toLowerCase().indexOf(filterValue) === 0 || cliente.apellidoPaterno.toLowerCase().indexOf(filterValue) === 0 || cliente.apellidoMaterno.toLowerCase().indexOf(filterValue) === 0;
    })
  }

  public clearInput(field: string) {
    this.proyectoForm.value[field] = 'da';
  }

  // ============> onInitForm
  private initForm(): void {
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
      estado: [true, Validators.required],
      fechaInicio: [Validators.required],
      fechaFinal: [Validators.required],
      lugarProyecto: ['', [Validators.required, Validators.maxLength(200)]],
      uuidCliente: ['', Validators.required],
    });

  }

  // // ===================> onAddProyecto
  // public onAddProyecto(proyecto: Proyecto): void {
  //   this.proyectoSvc.addProyecto(proyecto)
  //     .subscribe(usr => {
  //       if (usr) {
  //         this.toastrSvc.success('El proyecto se ha creado correctamente. 😀', 'Proyecto Creado');
  //         this.dialogRef.close(this.proyectoForm);
  //       }

  //     });

  // }

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
