import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Personal } from '@models/mendozarq/personal.interface';
import { PersonalService } from '@services/personal.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-new-personal',
  templateUrl: './new-personal.component.html',
  styleUrls: ['./new-personal.component.scss']
})
export class NewPersonalComponent implements OnInit {

  public personalForm: FormGroup;

  constructor(
    private personalSvc: PersonalService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewPersonalComponent>) { }

  ngOnInit(): void {
    this.initForm();
  }

  // ============> onInitForm
  private initForm(): void {
    this.personalForm = this.fb.group({

      nombre: ['franco', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      apellidoPaterno: ['medrano', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      apellidoMaterno: ['', [Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      celular: [69509449, [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern(/^[0-9]*$/)]],
      direccion: ['', [Validators.maxLength(200)]],
      correo: ['example@gmail.com', [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]],
      descripcion: ['Jefe responsable de las operaciones de las contrucciones', [Validators.required, Validators.maxLength(200)]],
      sueldo: [0, [Validators.required]],
      moneda: ['bs', Validators.required],
      activo: [true, [Validators.required]],
    });
  }

  // ===================> onAddPersonal
  public onAddPersonal(personal: Personal): void {
    this.personalSvc.addPersonal(personal)
      .subscribe(usr => {
        if (usr) {
          this.toastrSvc.success('El personal se ha creado correctamente. 😀', 'Personal Creado');
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
