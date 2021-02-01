import { MatDialog } from '@angular/material/dialog';
import { CategoriaRecursoService } from '@app/core/services/mendozarq/categoria-recurso.service';
import { CategoriaRecurso } from '@app/shared/models/mendozarq/categoria.recurso.interface'
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-new-categoria-recurso',
  templateUrl: './new-categoria-recurso.component.html',
  styleUrls: ['./new-categoria-recurso.component.scss']
})
export class NewCategoriaRecursoComponent implements OnInit {

  public newCategoriaRecursoForm: FormGroup = new FormGroup({
    nombre: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
  });


  constructor(
    private toastrSvc: ToastrService,
    private authSvc: AuthService,
    private categoriaRecursoSvc: CategoriaRecursoService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {

  };

  onAddUser(usuario: CategoriaRecurso): void {

    this.categoriaRecursoSvc.addCategoriaRecurso(usuario)
      .subscribe(usr => {
        if (usr) {
          this.toastrSvc.success('La categoria se ha creado correctamente', 'Categoria creada');
        }
      });
  }
}
