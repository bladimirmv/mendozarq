import { Component, OnInit } from '@angular/core';


import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  public newUserForm: FormGroup = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    celular: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    correo: new FormControl('', Validators.email),
    rol: new FormControl('', Validators.required)
  });

  constructor() { }

  ngOnInit(): void {
  }

  onAddUser(data): void {
    console.log(data);

  }

}
