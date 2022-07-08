import { MapProyectoComponent } from './../map-proyecto/map-proyecto.component';
import {
  Marker,
  LatLng,
} from './../../../../../../node_modules/@types/leaflet/index.d';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { ProyectoService } from '@services/mendozarq/proyecto.service';
import { UsuarioService } from '@services/auth/usuario.service';

import { ClienteModalComponent } from './../cliente-modal/cliente-modal.component';
import { Proyecto } from '@app/shared/models/mendozarq/proyecto.interface';
import { Usuario } from '@app/shared/models/usuario.interface';

import { Map, marker, tileLayer, Icon } from 'leaflet';
@Component({
  selector: 'app-new-proyecto',
  templateUrl: './new-proyecto.component.html',
  styleUrls: ['./new-proyecto.component.scss'],
})
export class NewProyectoComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<any>();

  public proyectoForm: FormGroup;
  private clientes: Usuario[] = [];
  public selectedClientes: Usuario[] = [];
  mapa: Map;
  projectMarker: Array<Marker> = [];

  customIcon = new Icon({
    iconUrl: './assets/marker.svg',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  constructor(
    private proyectoSvc: ProyectoService,
    private toastrSvc: ToastrService,
    private usuarioSvc: UsuarioService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private dialogRef: MatDialogRef<NewProyectoComponent>
  ) {}

  ngAfterViewInit(): void {
    this.mapa = new Map('map').setView([-17.40199, -66.18258], 18);

    tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      // 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
      // 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
      // 'https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png',
      // 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      // 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      // 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '',
      }
    ).addTo(this.mapa);

    this.projectMarker.push(
      marker([-17.40199, -66.18258], {
        draggable: true,
        title: 'titulo',
        icon: this.customIcon,
      }).addTo(this.mapa)
      // .bindPopup(`Lugar del Proyecto`)
      // .openPopup()
    );

    this.mapa.fitBounds;
    [
      [
        this.projectMarker[0].getLatLng().lat,
        this.projectMarker[0].getLatLng().lng,
      ],
    ];

    this.mapa.on('click', (e: any) => {
      this.projectMarker.forEach((m: Marker, i) => {
        this.mapa.removeLayer(this.projectMarker[i]);
      });

      this.projectMarker = [];

      this.projectMarker.push(
        marker([e.latlng.lat, e.latlng.lng], {
          draggable: true,
          icon: this.customIcon,
        }).addTo(this.mapa)
      );
    });
  }

  fullMap(): void {
    const dialogRef = this.dialog.open(MapProyectoComponent, {
      data: this.projectMarker[0].getLatLng(),
      width: '100%',
      height: '100%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res: Marker) => {
      this.projectMarker.forEach((m: Marker, i) => {
        this.mapa.removeLayer(this.projectMarker[i]);
      });
      this.projectMarker = [];
      this.mapa.fitBounds([[res.getLatLng().lat, res.getLatLng().lng]]);

      this.projectMarker.push(
        marker([res.getLatLng().lat, res.getLatLng().lng], {
          draggable: true,
          icon: this.customIcon,
        }).addTo(this.mapa)
      );
    });
  }

  getLocation() {
    console.log(this.projectMarker[0].getLatLng());
  }

  ngOnInit(): void {
    this.initForm();
    this.initDataClientes();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // =====================> onInitForm
  private initForm(): void {
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', Validators.maxLength(200)],
      estado: [true, Validators.required],
      fechaInicio: [Validators.required],
      fechaFinal: [Validators.required],
      lugarProyecto: ['', Validators.maxLength(200)],
      uuidCliente: ['', Validators.required],
      categoria: ['construccion', Validators.required],
    });
  }

  // ===================> initDataClientes
  private initDataClientes(): void {
    this.usuarioSvc
      .getAllUsuarios()
      .pipe(
        map((usuarios: Usuario[]) =>
          usuarios.filter((usuario: Usuario) => usuario.rol === 'cliente')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((clientes: Usuario[]) => {
        if (!clientes.length) {
          const dialogRef = this.dialog.open(ClienteModalComponent);

          dialogRef
            .afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                dialogRef.close();
                this.dialogRef.close(this.proyectoForm);
                this.router.navigate(['admin/usuarios']);
              } else {
                dialogRef.close();
                this.dialogRef.close(this.proyectoForm);
              }
            });
        }
        this.selectedClientes = clientes;
        this.clientes = clientes;
      });
  }

  // ===================> onAddProyecto
  public onAddProyecto(proyecto: Proyecto): void {
    proyecto.porcentaje = 0;
    this.proyectoSvc
      .addProyecto(proyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((proy) => {
        if (proy) {
          this.toastrSvc.success(
            'El proyecto se ha creado correctamente. 😀',
            'Proyecto Creado'
          );
          this.dialogRef.close();
        }
      });
  }

  // ===========> isValidField
  public isValidField(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.proyectoForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }

  // ============> onKeySearch
  public onKey(value) {
    this.selectedClientes = this._filter(value);
  }

  // ============> filterCliente
  private _filter(value: string): Usuario[] {
    const filterValue = value.toLowerCase();

    return this.clientes.filter((cliente) => {
      return (
        cliente.nombre.toLowerCase().indexOf(filterValue) === 0 ||
        cliente.apellidoPaterno.toLowerCase().indexOf(filterValue) === 0 ||
        cliente.apellidoMaterno.toLowerCase().indexOf(filterValue) === 0
      );
    });
  }
}
