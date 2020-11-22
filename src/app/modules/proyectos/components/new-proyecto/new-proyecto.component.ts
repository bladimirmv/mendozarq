import { CategoriaProyectoService } from '@services/categoria-proyecto.service';
import { AuthService } from '@services/auth.service';
import { Usuario } from '@app/shared/models/usuario.interface';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ProyectoService } from './../../../../core/services/proyecto.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Proyecto } from '@app/shared/models/mendozarq/proyecto.interface';
import { CategoriaProyecto } from '@app/shared/models/mendozarq/categoria.proyecto.interface';

@Component({
  selector: 'app-new-proyecto',
  templateUrl: './new-proyecto.component.html',
  styleUrls: ['./new-proyecto.component.scss']
})
export class NewProyectoComponent implements OnInit {

  public $clientes: Observable<Usuario[]>;
  public $categoriasProyecto: Observable<CategoriaProyecto[]>;


  public newProyecto: FormGroup = new FormGroup(
    {
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl(''),
      categoria: new FormControl('', Validators.required),
      estado: new FormControl('activo', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaFinal: new FormControl('', Validators.required),
      lugarProyecto: new FormControl('', Validators.required),
      filerefCont: new FormControl(''),
      urlCont: new FormControl(''),
      idCliente: new FormControl('', Validators.required),
      porcentaje: new FormControl(0),

    });
  constructor(
    private proyectoSvc: ProyectoService,
    private toastrSvc: ToastrService,
    private authSvc: AuthService,
    private catProyecto: CategoriaProyectoService) { }

  ngOnInit(): void {
    this.$clientes = this.authSvc.getAllUsuariosByTipo('cliente');
    this.$categoriasProyecto = this.catProyecto.getAllCategoriaProyecto();
  }

  onAddProyecto(proyecto: Proyecto): void {
    this.proyectoSvc.addProyecto(proyecto)
      .then(() => {
        this.toastrSvc.success('Se hacreado exitosamente', 'Proyecto Creado');
      })
      .catch(error => this.toastrSvc.success(`Error: ${error}`, 'Ocurrio un Error'));
  }


}
