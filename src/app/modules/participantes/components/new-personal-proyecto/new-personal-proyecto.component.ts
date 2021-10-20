import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParticipantesProyectoService } from '@app/core/services/mendozarq/participantes-proyecto.service';
import { WarningModalComponent } from '@app/shared/components/warning-modal/warning-modal.component';
import { PersonalProyecto } from '@app/shared/models/mendozarq/participante.proyecto.interface';
import { Personal } from '@app/shared/models/mendozarq/personal.interface';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NewPersonalComponent } from '@app/modules/personal/components/new-personal/new-personal.component';

export interface warningDialog {
  title: string;
  paragraph: string;
  btnPrimary: string;
};

@Component({
  selector: 'app-new-personal-proyecto',
  templateUrl: './new-personal-proyecto.component.html',
  styleUrls: ['./new-personal-proyecto.component.scss']
})
export class NewPersonalProyectoComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any> = new Subject<any>();

  public personalProyectoForm: FormGroup;
  private personal: Personal[] = [];
  public selectedPersonal: Personal[] = [];
  public personalGroup: Personal[] = [];


  constructor(
    private participantesSvc: ParticipantesProyectoService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewPersonalProyectoComponent>,
    private matdialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private personalProyecto: PersonalProyecto,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllPersonal();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.personalProyectoForm = this.fb.group({
      personal: [[], Validators.required],
    });
  }

  private getAllPersonal(): void {
    this.participantesSvc.getAllPersonalByUuid(this.personalProyecto.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((personal: Personal[]) => {
        this.personal = personal;
        this.selectedPersonal = personal;
        const warningDialog: warningDialog = {
          title: 'Sin Personal',
          paragraph: 'No hay personal disponible para asignar a este proyecto.',
          btnPrimary: 'Registrar'
        };
        if (!personal.length) {
          const dialogRef = this.matdialog.open(WarningModalComponent, {
            data: warningDialog
          });

          dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                this.router.navigate(['admin/personal']);
                this.dialogRef.close(false);
              } else {
                this.dialogRef.close(false);
              }
            });
        }
      });
  }

  public newPersonal(personal: Personal[]): void {

    const personalProyecto: PersonalProyecto[] = [];

    personal.forEach((p: Personal) => {
      personalProyecto.push({
        uuidPersonal: p.uuid,
        uuidProyecto: this.personalProyecto.uuidProyecto
      })
    });

    this.participantesSvc.addPersonalProyecto(personalProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('Se ha añadido correctamente. 😀', 'Personal Asignado');
          this.dialogRef.close(true);
        }
      });
  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.personalProyectoForm.get(field);
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

    return this.personal.filter(cliente => {
      return cliente.nombre.toLowerCase().indexOf(filterValue) === 0
        || cliente.apellidoPaterno.toLowerCase().indexOf(filterValue) === 0
        || cliente.apellidoMaterno.toLowerCase().indexOf(filterValue) === 0;
    })
  }


}
