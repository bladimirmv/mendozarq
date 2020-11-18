import { Component, Inject, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Personal } from '@models/mendozarq/personal.interface';
import { PersonalService } from '@services/personal.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-personal',
  templateUrl: './edit-personal.component.html',
  styleUrls: ['./edit-personal.component.scss']
})
export class EditPersonalComponent implements OnInit {
  public updatePersonal: FormGroup = new FormGroup({

    nombre: new FormControl(this.data.nombre, Validators.required),
    apellidos: new FormControl(this.data.apellidos, Validators.required),
    celular: new FormControl(this.data.celular, Validators.required),
    direccion: new FormControl(this.data.direccion, Validators.required),
    correo: new FormControl(this.data.correo, Validators.email),
    cargo: new FormControl(this.data.cargo, Validators.required),
    sueldo: new FormControl(this.data.sueldo, Validators.required),
    moneda: new FormControl(this.data.moneda, Validators.required),
    idPersonal: new FormControl(this.data.idPersonal, Validators.required)
  });

  constructor(
    private personalSvc: PersonalService,
    private toastrSvc: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Personal) {

  }

  ngOnInit(): void {
  }

  public onUpdatePersonal(personal: Personal): void {
    console.log(personal);

    this.personalSvc.updatePersonal(personal)
      .then(() => {
        this.toastrSvc.success('Se ha editado correctamente', 'Personal editado');
      })
      .catch((error) => {
        this.toastrSvc.error(`Error: ${error}`, 'Se ha producido un Error!');
      });
  }
}
