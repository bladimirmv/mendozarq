import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ServicioProyecto } from '@models/mendozarq/servicio.proyecto.interface';
import { takeUntil } from 'rxjs/operators';
import { ObservacionServicioService } from '@app/core/services/mendozarq/observacion-servicio.service';
import { ObservacionServicio } from '@app/shared/models/mendozarq/observacion.servicio.interface';
import * as moment from 'moment';
import { WarningModalComponent } from '@app/shared/components/warning-modal/warning-modal.component';
import { Router } from '@angular/router';

export interface warningDialog {
  title: string;
  paragraph: string;
  btnPrimary: string;
};
@Component({
  selector: 'app-new-observacion-servicio',
  templateUrl: './new-observacion-servicio.component.html',
  styleUrls: ['./new-observacion-servicio.component.scss']
})
export class NewObservacionServicioComponent implements OnInit, OnDestroy {

  public selectedServicio: ServicioProyecto[] = [];
  public servicio: ServicioProyecto[] = [];

  private destroy$ = new Subject<any>();
  public servicioForm: FormGroup;
  public estados: Array<string> = ['En curso', 'Pendiente', 'Con retraso', 'Fecha limite', 'Finalizado'];

  constructor(
    private observacionServicioSvc: ObservacionServicioService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewObservacionServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sp?: ServicioProyecto; uuidVisita: string; disabled: boolean },
    private matdialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllServiciosProyecto();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ============> onInitForm
  private initForm(): void {
    this.servicioForm = this.fb.group({
      uuidServicio: [{ value: this.data.sp ? this.data.sp.uuid : '', disabled: this.data.disabled }, Validators.required],
      estado: ['En curso', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  // ====================> getAllServiciosProyecto
  public getAllServiciosProyecto(): void {
    this.observacionServicioSvc
      .getAllServiciosByUuidVisita(this.data.uuidVisita)
      .pipe(takeUntil(this.destroy$))
      .subscribe((servicio: ServicioProyecto[]) => {
        this.selectedServicio = servicio;
        this.servicio = servicio;

        const warningDialog: warningDialog = {
          title: 'Sin Servicios',
          paragraph: 'No hay servicios disponibles en el proyecto para asignar una observacion.',
          btnPrimary: 'Continuar'
        };
        if (!servicio.length) {
          const dialogRef = this.matdialog.open(WarningModalComponent, {
            data: warningDialog
          });
          dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              this.dialogRef.close(false);
            });
        }
      });
  }

  // ===================> addObservacionServicio
  public addObservacionServicio(observacionServicio: ObservacionServicio): void {
    this.data.sp
      ? observacionServicio.uuidServicio = this.data.sp.uuid
      : null;
    observacionServicio.uuidVisita = this.data.uuidVisita;
    observacionServicio.fecha = new Date(moment().format('YYYY-MM-DD'));

    this.observacionServicioSvc.addObservacionServicio(observacionServicio)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('La observacion se ha creado correctamente. 😀', 'Observacion Creado');
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
  // ============> onKeySearch
  public onKey(value) {
    this.selectedServicio = this._filter(value);
  }

  // ============> filterCliente
  private _filter(value: string): ServicioProyecto[] {
    const filterValue = value.toLowerCase();
    return this.servicio.filter(servicio => {
      return servicio.nombre.toLowerCase().indexOf(filterValue) === 0;
    })
  }

  // ============> getTime
  getTime(date: Date): string {
    moment.locale('es');
    return moment(date).format('MMMM Do YYYY');
  }


}
