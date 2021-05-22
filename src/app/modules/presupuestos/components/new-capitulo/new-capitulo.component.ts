import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CapituloPresupuesto } from '@app/shared/models/mendozarq/presupuestos.interface';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CapituloPresupuestoService } from '@services/mendozarq/capitulo-presupuesto.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-new-capitulo',
  templateUrl: './new-capitulo.component.html',
  styleUrls: ['./new-capitulo.component.scss']
})
export class NewCapituloComponent implements OnInit, OnDestroy {

  public capituloForm: FormGroup;
  private destroy$: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewCapituloComponent>,
    private toastrSvc: ToastrService,
    private capituloSvc: CapituloPresupuestoService,
    @Inject(MAT_DIALOG_DATA) private uuidPresupuesto: string

  ) { }

  ngOnInit(): void {
    this.initForm();
  }


  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ============> onInitForm
  private initForm(): void {
    this.capituloForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[0-9a-z\s]+$/)]],
    });
  }

  // ===================>
  public addCapituloPresupuesto(capituloPresupuesto: CapituloPresupuesto): void {
    capituloPresupuesto.uuidPresupuestoObra = this.uuidPresupuesto;

    this.capituloSvc.addCapituloPresupuesto(capituloPresupuesto)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('El capitulo se ha creado correctamente. 😀', 'Servicio Creado');
          this.dialogRef.close(true);
        }
      });

  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.capituloForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }
}
