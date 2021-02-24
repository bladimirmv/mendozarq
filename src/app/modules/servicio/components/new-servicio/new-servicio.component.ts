import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicioProyectoService } from '@app/core/services/mendozarq/servicio-proyecto.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ServicioProyecto } from '@models/mendozarq/servicio.proyecto.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-new-servicio',
  templateUrl: './new-servicio.component.html',
  styleUrls: ['./new-servicio.component.scss']
})
export class NewServicioComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<any>();
  public servicioForm: FormGroup;

  constructor(
    private servicioProyectoSvc: ServicioProyectoService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewServicioComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ServicioProyecto) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ============> onInitForm
  private initForm(): void {
    this.servicioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[0-9a-z\s]+$/)]],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
      avance: [0, Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required]
    });
  }

  // ===================> onAddServicio
  public onAddServicio(servicioProyecto: ServicioProyecto): void {
    servicioProyecto.uuidProyecto = this.data.uuidProyecto;
    this.servicioProyectoSvc.addServicioProyecto(servicioProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('El servicio se ha creado correctamente. 😀', 'Servicio Creado');
          this.dialogRef.close(true);
        }

      });

  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.servicioForm.get(field);
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

  formatLabel(value: number) {
    if (value >= 1) {
      return value + '';
    }
    return value;
  }

  updateValue(event) {
    const slider = document.querySelector('#avance-slider');
    if (event.value > 50) {
      slider.classList.add('max');
      slider.classList.remove('min');
    } else {
      slider.classList.add('min');
      slider.classList.remove('max');
    }

  }

}
