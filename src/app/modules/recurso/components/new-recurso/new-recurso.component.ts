import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core/services/auth.service';


import { RecursoService } from '@services/recurso.service';
import { Recurso } from '@app/shared/models/mendozarq/recurso.interface'
import { CategoriaRecursoService } from '@services/categoria-recurso.service'
import { CategoriaRecurso } from '@models/mendozarq/categoria.recurso.interface'


import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-new-recurso',
  templateUrl: './new-recurso.component.html',
  styleUrls: ['./new-recurso.component.scss']
})
export class NewRecursoComponent implements OnInit {
  public categoriasRecursos$: Observable<CategoriaRecurso[]>;
  public categoriaRecurso: CategoriaRecurso[];

  public newRecursoForm: FormGroup = new FormGroup({
    nombre: new FormControl('Viga de concreto', Validators.required),
    // color: new FormControl('#000000',Validators.required),
    descripcion: new FormControl('Vigas de soporte hechas de concreto', Validators.required),
    estado: new FormControl('Disponible',Validators.required),
    idCategoriaRecurso: new FormControl('Categoria 1', Validators.required)
  });


  constructor(
    private toastrSvc: ToastrService,
    private authSvc: AuthService,
    private recursoSvc: RecursoService,
    private categoriaRecursoSvc: CategoriaRecursoService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCategoriasRecurso();
  }

  // ====================================================================
  getCategoriasRecurso(): void {
    this.categoriasRecursos$ = this.categoriaRecursoSvc.getAllCategoriasRecurso();
    this.categoriaRecursoSvc.getAllCategoriasRecurso()
      .subscribe(res => {
        this.categoriaRecurso = res;
      });
  }
  // ====================================================================
  onAddUser(usuario: Recurso): void {

    this.recursoSvc.addRecurso(usuario)
      .subscribe(usr => {
        if (usr) {
          this.toastrSvc.success('Recurso creado', 'Recurso creada');
        }
      });
  }
}
