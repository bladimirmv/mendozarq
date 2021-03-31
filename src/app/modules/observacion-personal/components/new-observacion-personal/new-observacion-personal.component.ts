import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ObservacionPersonal } from '@app/shared/models/mendozarq/observacion.personal.interface';
import * as moment from 'moment';
import { Personal } from '@app/shared/models/mendozarq/personal.interface';
import { ObservacionPersonalService } from '@app/core/services/mendozarq/observacion-personal.service';

@Component({
  selector: 'app-new-observacion-personal',
  templateUrl: './new-observacion-personal.component.html',
  styleUrls: ['./new-observacion-personal.component.scss']
})
export class NewObservacionPersonalComponent implements OnInit, OnDestroy {

  public selectedPersonal: Personal[] = [];
  public personal: Personal[] = [];

  private destroy$ = new Subject<any>();
  public personalForm: FormGroup;
  public estados: Array<string> = ['En curso', 'Pendiente', 'Fecha limite', 'Aprobar', 'Con retraso', 'Finalizado'];

  constructor(
    private observacionPersonalSvc: ObservacionPersonalService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewObservacionPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { personal?: Personal; uuidVisita: string; disabled: boolean }) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllPersonalProyecto();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ============> onInitForm
  private initForm(): void {
    this.personalForm = this.fb.group({
      uuidPersonal: [{ value: this.data.personal ? this.data.personal.uuid : '', disabled: this.data.disabled }, Validators.required],
      estado: ['En curso', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  // ====================> getAllPersonalProyecto
  public getAllPersonalProyecto(): void {
    this.observacionPersonalSvc
      .getAllPersonalByUuidVisita(this.data.uuidVisita)
      .pipe(takeUntil(this.destroy$))
      .subscribe((personal: Personal[]) => {
        this.selectedPersonal = personal;
        this.personal = personal;
      });
  }

  // ===================> addObservacionPersonal
  public addObservacionPersonal(observacionPersonal: ObservacionPersonal): void {
    this.data.personal
      ? observacionPersonal.uuidPersonal = this.data.personal.uuid
      : null;
    observacionPersonal.uuidVisita = this.data.uuidVisita;
    observacionPersonal.fecha = new Date(moment().format('YYYY-MM-DD'));

    this.observacionPersonalSvc.addObservacionPersonal(observacionPersonal)
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
    const validateFIeld = this.personalForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }
  // ============> onKeySearch
  public onKey(value) {
    this.selectedPersonal = this._filter(value);
  }

  // ============> filterCliente
  private _filter(value: string): Personal[] {
    const filterValue = value.toLowerCase();
    return this.personal.filter(personal => {
      return personal.nombre.toLowerCase().indexOf(filterValue) === 0
        || personal.apellidoPaterno.toLowerCase().indexOf(filterValue) === 0
        || personal.apellidoMaterno.toLowerCase().indexOf(filterValue) === 0;
    })
  }

  // ============> getTime
  getTime(date: Date): string {
    moment.locale('es');
    return moment(date).format('MMMM Do YYYY');
  }
}
