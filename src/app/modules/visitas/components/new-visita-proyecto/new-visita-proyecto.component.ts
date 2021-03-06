import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitaProyectoService } from '@app/core/services/mendozarq/visita-proyecto.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { VisitaProyecto } from '@models/mendozarq/visita.proyecto.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-new-visita-proyecto',
  templateUrl: './new-visita-proyecto.component.html',
  styleUrls: ['./new-visita-proyecto.component.scss']
})
export class NewVisitaProyectoComponent implements OnInit {
  private destroy$ = new Subject<any>();
  public visitaForm: FormGroup;

  constructor(
    private visitaProyectoSvc: VisitaProyectoService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewVisitaProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: VisitaProyecto) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ============> onInitForm
  private initForm(): void {
    this.visitaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[0-9a-z\s]+$/)]],
      faseDelProyecto: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(200)]],
      fecha: ['', Validators.required],
    });
  }

  // ===================> onAddVisita
  public addVisita(visitaProyecto: VisitaProyecto): void {
    visitaProyecto.uuidProyecto = this.data.uuidProyecto;
    console.log(visitaProyecto);

    this.visitaProyectoSvc.addVisitaProyecto(visitaProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('La visita se ha creado correctamente. 😀', 'Visita Creado');
          this.dialogRef.close(true);
        }

      });

  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.visitaForm.get(field);
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
