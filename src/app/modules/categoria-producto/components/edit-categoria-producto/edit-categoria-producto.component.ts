import { CategoriaProducto } from './../../../../shared/models/liraki/categoria.producto.interface';
import { NewCategoriaProductoComponent } from './../new-categoria-producto/new-categoria-producto.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriaProductoService } from './../../../../core/services/liraki/categoria-producto.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-categoria-producto',
  templateUrl: './edit-categoria-producto.component.html',
  styleUrls: ['./edit-categoria-producto.component.scss']
})
export class EditCategoriaProductoComponent implements OnInit, OnDestroy {


  public categoriaForm: FormGroup;

  private destroy$: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private categoriaProductoSvc: CategoriaProductoService,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<NewCategoriaProductoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: CategoriaProducto
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
      nombre: [this.data.nombre, [Validators.required, Validators.maxLength(50)]],
      descripcion: [this.data.description, Validators.maxLength(200)]
    });
  }

  public updateCategoriaProducto(categoriaProducto: CategoriaProducto): void {
    categoriaProducto.uuid = this.data.uuid;
    this.categoriaProductoSvc
      .updateCategoriaProducto(this.data.uuid, categoriaProducto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.toastrSvc.success('La categoria se ha actualizado corectamente. 😀', 'Categoria Actualizado');
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
