import { takeUntil } from 'rxjs/operators';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

import { Personal } from '@models/mendozarq/personal.interface';
import { PersonalService } from '@services/personal.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-personal',
  templateUrl: './edit-personal.component.html',
  styleUrls: ['./edit-personal.component.scss']
})
export class EditPersonalComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<any>();
  public personalForm: FormGroup;


  constructor(
    private personalSvc: PersonalService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Personal) {

  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }


  // ============> onInitForm
  private initForm(): void {
    this.personalForm = this.fb.group({
      nombre: [this.data.nombre, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      apellidoPaterno: [this.data.apellidoPaterno, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      apellidoMaterno: [this.data.apellidoMaterno, [Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      celular: [this.data.celular, [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern(/^[0-9]*$/)]],
      direccion: [this.data.direccion, [Validators.maxLength(200)]],
      correo: [this.data.correo, [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]],
      descripcion: [this.data.descripcion, [Validators.required, Validators.maxLength(200)]],
      sueldo: [this.data.sueldo, [Validators.required]],
      moneda: [this.data.moneda, Validators.required],
      activo: [this.data.activo ? true : false, [Validators.required]],
    });
  }

  public onUpdatePersonal(personal: Personal): void {

    this.personalSvc.updatePersonal(this.data.uuid, personal)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('Se ha actualizado el personal correctamente. 😀', 'Perosnal Actualizado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.dialogRef.close(this.personalForm);
        }
      });

  }
  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.personalForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }

  // ===========> getString
  getString(num: number): string {
    return String(num);
  }
}
