import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Inject } from '@angular/core';

import { Validators, FormGroup, FormControl } from '@angular/forms';

import { CategoriaProyecto } from '@models/mendozarq/categoria.proyecto.interface';
import { CategoriaProyectoService } from '@services/categoria-proyecto.service';
@Component({
  selector: 'app-edit-categoria-proyecto',
  templateUrl: './edit-categoria-proyecto.component.html',
  styleUrls: ['./edit-categoria-proyecto.component.scss']
})
export class EditCategoriaProyectoComponent implements OnInit {

  public updateCategoriaProyecto: FormGroup = new FormGroup({
    nombre: new FormControl(this.data.nombre, Validators.required),
    color: new FormControl(this.data.color, Validators.required),
    idCatProyecto: new FormControl(this.data.idCatProyecto)
  });


  constructor(
    private catProyetoSvc: CategoriaProyectoService,
    private toastrSvc: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: CategoriaProyecto) { }

  ngOnInit(): void {

  }

  onUpdateCategoriaProyecto(catProyecto: CategoriaProyecto): void {
    this.catProyetoSvc.updateCategoriaProyecto(catProyecto)
      .then(() => {
        this.toastrSvc.success('Se ha editado correctamente', 'Editado Coreectamente');
      })
      .catch((error) => {
        this.toastrSvc.error(`Error: ${error}`, 'Se ha producido un Error');
      });
  }

}
