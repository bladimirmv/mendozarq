import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Personal } from '@models/mendozarq/personal.interface';
import { PersonalService } from '@services/personal.service';
@Component({
  selector: 'app-new-personal',
  templateUrl: './new-personal.component.html',
  styleUrls: ['./new-personal.component.scss']
})
export class NewPersonalComponent implements OnInit {

  public newPersonal: FormGroup = new FormGroup({

    nombre: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    celular: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    correo: new FormControl('', Validators.email),
    cargo: new FormControl('', Validators.required),
    sueldo: new FormControl('', Validators.required),
    moneda: new FormControl('bs', Validators.required)

  });

  constructor(private personalSvc: PersonalService, private toastrSvc: ToastrService) { }

  ngOnInit(): void {
  }

  public onAddPersonal(personal: Personal): void {
    this.personalSvc.addPersonal(personal)
      .then(() => {
        this.toastrSvc.success('Se ha creado correctamente', 'Personal creado');
      })
      .catch((error) => {
        this.toastrSvc.error(`Error: ${error}`, 'Se ha producido un Error!');
      });
  }

}
