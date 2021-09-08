import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriaProducto } from '@models/liraki/categoria.producto.interface';
import { CategoriaProductoService } from '@services/liraki/categoria-producto.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-new-categoria-producto',
  templateUrl: './new-categoria-producto.component.html',
  styleUrls: ['./new-categoria-producto.component.scss']
})
export class NewCategoriaProductoComponent implements OnInit, OnDestroy {

  public categoriaForm: FormGroup;

  private destroy$: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private categoriaProductoSvc: CategoriaProductoService,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<NewCategoriaProductoComponent>
  ) { }


  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', Validators.maxLength(200)]
    });
  }

  public addCategoriaProducto(categoriaProducto: CategoriaProducto): void {
    console.log('add 1');

    this.categoriaProductoSvc
      .addCategoriaProducto(categoriaProducto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log('add 2');

        this.toastrSvc.success('La categoria se ha creado corectamente. 😀', 'Categoria Creado');
        this.dialogRef.close(true);
      });
  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.categoriaForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }
}
