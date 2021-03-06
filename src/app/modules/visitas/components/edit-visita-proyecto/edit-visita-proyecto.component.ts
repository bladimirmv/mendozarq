import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitaProyectoService } from '@app/core/services/mendozarq/visita-proyecto.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { VisitaProyecto } from '@models/mendozarq/visita.proyecto.interface';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
@Component({
  selector: 'app-edit-visita-proyecto',
  templateUrl: './edit-visita-proyecto.component.html',
  styleUrls: ['./edit-visita-proyecto.component.scss']
})
export class EditVisitaProyectoComponent implements OnInit {

  private destroy$ = new Subject<any>();
  public visitaForm: FormGroup;

  constructor(
    private visitaProyectoSvc: VisitaProyectoService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditVisitaProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VisitaProyecto) { }

  ngOnInit(): void {
    this.initForm();
    console.log(this.data);

  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ============> onInitForm
  private initForm(): void {
    this.visitaForm = this.fb.group({
      nombre: [this.data.nombre, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[0-9a-z\s]+$/)]],
      faseDelProyecto: [this.data.faseDelProyecto, [Validators.required, Validators.maxLength(100)]],
      descripcion: [this.data.descripcion, [Validators.maxLength(200)]],
      fecha: [moment(this.data.fecha).format('YYYY-MM-DThh:mm:ss') as string, Validators.required],
    });
  }

  // ===================> onAddVisita
  public updateVisita(visitaProyecto: VisitaProyecto): void {
    visitaProyecto.uuidProyecto = this.data.uuidProyecto;
    this.visitaProyectoSvc.updateVisitaProyecto(this.data.uuid, visitaProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('La visita se ha actualizado correctamente. 😀', 'Visita Actualizado');
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
