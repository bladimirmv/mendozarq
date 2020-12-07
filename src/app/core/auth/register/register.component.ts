import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Usuario, Roles } from '@app/shared/models/usuario.interface';
import { empty, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;


  public formRegistro: FormGroup = new FormGroup({
    nombre: new FormControl({ value: '', disabled: true }),
    apellidos: new FormControl({ value: '', disabled: true }),
    celular: new FormControl({ value: '', disabled: true }),
    direccion: new FormControl({ value: '', disabled: true }),
    correo: new FormControl('', Validators.email),
    rol: new FormControl({ value: '', disabled: true }),
    contrasenha: new FormControl('', Validators.required)
  });

  usuarioData: Usuario;
  id: string;
  private rol: Roles;
  constructor(
    private authSvc: AuthService,
    private route: ActivatedRoute,
    private toastrSvc: ToastrService,
    private router: Router) { }

  ngOnInit(): void {

    // this.id = this.route.snapshot.paramMap.get('id');
    // this.authSvc.getOneUsuario(this.id)
    //   .subscribe(res => {
    //     this.usuarioData = res;
    //     if (res) {
    //       this.formRegistro.patchValue({
    //         nombre: res.nombre ? res.nombre : 'sin nombre',
    //         apellidos: res.apellidos ? res.apellidos : 'sin apellidos',
    //         celular: res.celular ? res.celular : 'sin celular',
    //         direccion: res.direccion ? res.direccion : 'sin direccion',
    //         correo: res.correo,
    //         rol: res.rol
    //       });
    //       this.rol = res.rol;
    //     } else {
    //       this.usuarioData = null;
    //     }

    //   });
  }

  onRegister(usr: Usuario): void {
    // usr.docid = this.id;
    // this.authSvc.registerUsuario(usr)
    //   .then(() => {
    //     this.toastrSvc.success('Cuenta creada exitosamente.', 'Bienvenido!');
    //     switch (this.rol) {
    //       case 'administrador':
    //         this.router.navigate(['/admin']);
    //         break;
    //       default:
    //         break;
    //     }
    //   })
    //   .catch((error) => {
    //     this.toastrSvc.error(error, 'Ocurrio un Error!');
    //     console.log(error);

    //   });
  }

}
