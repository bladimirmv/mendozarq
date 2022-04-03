import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitaProyectoService } from '@app/core/services/mendozarq/visita-proyecto.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { VisitaProyecto } from '@models/mendozarq/visita.proyecto.interface';
import { takeUntil, startWith } from 'rxjs/operators';
import * as moment from 'moment';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
@Component({
  selector: 'app-edit-visita-proyecto',
  templateUrl: './edit-visita-proyecto.component.html',
  styleUrls: ['./edit-visita-proyecto.component.scss'],
})
export class EditVisitaProyectoComponent implements OnInit {
  private destroy$ = new Subject<any>();
  public visitaForm: FormGroup;

  // chips
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tareaCtrl = new FormControl();
  filteredTareas: string[];
  tareas: string[] = [];
  allTareas: string[] = [];

  @ViewChild('tareaInput') tareaInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(
    private visitaProyectoSvc: VisitaProyectoService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditVisitaProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VisitaProyecto
  ) {
    this.tareaCtrl.valueChanges
      .pipe(startWith(null))
      .subscribe((tarea: string | null) => {
        this.filteredTareas = tarea
          ? this._filter(tarea)
          : this.allTareas.slice();
      });
  }

  ngOnInit(): void {
    this.initForm();

    this.visitaProyectoSvc
      .getAllTareasProyecto(this.data.uuidProyecto)
      .subscribe((tareas) => {
        this.allTareas = tareas.map((t) => t.nombre);
        this.filteredTareas = this.allTareas;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ============> onInitForm
  private initForm(): void {
    this.visitaForm = this.fb.group({
      nombre: [
        this.data.nombre,
        [Validators.required, Validators.maxLength(50)],
      ],

      descripcion: [this.data.descripcion, [Validators.maxLength(200)]],
      fecha: [
        moment(this.data.fecha).format('YYYY-MM-DThh:mm:ss') as string,
        Validators.required,
      ],
    });

    this.tareas = this.data.faseDelProyecto.split(' <=> ');
  }

  // ===================> onAddVisita
  public updateVisita(visitaProyecto: VisitaProyecto): void {
    visitaProyecto.uuidProyecto = this.data.uuidProyecto;
    visitaProyecto.faseDelProyecto = this.tareas.join(' <=> ');

    this.visitaProyectoSvc
      .updateVisitaProyecto(this.data.uuid, visitaProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.toastrSvc.success(
            'La visita se ha actualizado correctamente. 😀',
            'Visita Actualizado'
          );
          this.dialogRef.close(true);
        }
      });
  }

  // ===========> isValidField
  public isValidField(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.visitaForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }

  // ===========> getString
  getString(num: number): string {
    return String(num);
  }

  // **chips
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tarea
    if ((value || '').trim()) {
      this.tareas.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tareaCtrl.setValue(null);
  }

  remove(tarea: string): void {
    const index = this.tareas.indexOf(tarea);

    if (index >= 0) {
      this.tareas.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tareas.push(event.option.viewValue);
    this.tareaInput.nativeElement.value = '';
    this.tareaCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTareas.filter(
      (tarea) => tarea.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
