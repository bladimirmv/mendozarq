import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoriaProyectoService } from '@services/categoria-proyecto.service';
import { Component, OnInit } from '@angular/core';
import { CategoriaProyecto } from '@models/mendozarq/categoria.proyecto.interface';

@Component({
  selector: 'app-new-categoria-proyecto',
  templateUrl: './new-categoria-proyecto.component.html',
  styleUrls: ['./new-categoria-proyecto.component.scss']
})
export class NewCategoriaProyectoComponent implements OnInit {
  public newCategoriaProyecto: FormGroup = new FormGroup({
    nombre: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required)
  });


  constructor(private catProyectoSvc: CategoriaProyectoService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  onAddCategotiProyecto(catProyecto): void {
    this.catProyectoSvc.addCategoriaProyecto(catProyecto)
      .then(() => {
        this.toastr.success('Se ha creado corectamente', 'Categoria Creado');
      })
      .catch((error) => {
        this.toastr.error(`Error: ${error}`, 'Se ha producido un error');
      });
  }
}
