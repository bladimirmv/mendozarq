import { MapProyectoComponent } from './../map-proyecto/map-proyecto.component';
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

import { Map, marker, tileLayer, Icon, control, LatLng, Marker } from 'leaflet';
import * as l from 'leaflet-control-geocoder';
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

  // *maps leaflet =====================================================>
  private mapa: Map;
  private projectMarker: Array<Marker> = [];
  private customIcon = new Icon({
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

  ngOnInit(): void {
    this.initForm();
    this.initDataClientes();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.mapa = new Map('map', {
      maxZoom: 19,
    }).setView([-17.401848609775207, -66.18253244641603], 19);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.mapa);

    control.scale({ position: 'bottomleft' }).addTo(this.mapa);

    // **Geocoder map ============================================>
    l.geocoder({
      defaultMarkGeocode: false,
      placeholder: 'Buscar...',
      errorMessage: 'No se encontró la dirección',
      iconLabel: '📍',
      suggestMinLength: 10,
    })
      .addTo(this.mapa)
      .on('markgeocode', (e) => {
        this.projectMarker.forEach((m: Marker, i) => {
          this.mapa.removeLayer(this.projectMarker[i]);
        });

        this.projectMarker = [];

        this.projectMarker.push(
          marker([e.geocode.center.lat, e.geocode.center.lng], {
            draggable: true,
            icon: this.customIcon,
          })
            .addTo(this.mapa)
            .bindPopup(e.geocode.name, {
              closeOnClick: false,
              autoClose: false,
              closeButton: false,
            })
            .openPopup()
        );

        const bbox = e.geocode.bbox;
        this.mapa.fitBounds([
          [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
          [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
          [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
          [bbox.getSouthWest().lat, bbox.getSouthWest().lng],
        ]);
      });

    this.projectMarker.push(
      marker([-17.40199, -66.18258], {
        draggable: true,
        title: 'map mendozarq',
        icon: this.customIcon,
      }).addTo(this.mapa)
    );

    this.mapa.fitBounds([
      [
        this.projectMarker[0].getLatLng().lat,
        this.projectMarker[0].getLatLng().lng,
      ],
    ]);

    // **On click map ============================================>
    this.mapa.on('click', (e: { latlng: LatLng }) => {
      this.projectMarker.forEach((m: Marker, i) => {
        this.mapa.removeLayer(this.projectMarker[i]);
      });

      this.projectMarker = [];

      this.projectMarker.push(
        marker([e.latlng.lat, e.latlng.lng], {
          draggable: true,
          icon: this.customIcon,
        })
          .addTo(this.mapa)
          .bindPopup(e.latlng.toString(), {
            closeOnClick: false,
            autoClose: false,
            closeButton: false,
          })
          .openPopup()
      );
    });
  }

  // **On open full map ============================================>
  public fullMap(): void {
    const dialogRef = this.dialog.open(MapProyectoComponent, {
      data: {
        latLng: this.projectMarker[0].getLatLng(),
      },
      width: '100%',
      height: '100%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res: Marker) => {
      if (res) {
        this.projectMarker.forEach((m: Marker, i) => {
          this.mapa.removeLayer(this.projectMarker[i]);
        });

        this.projectMarker = [];

        this.projectMarker.push(
          marker([res.getLatLng().lat, res.getLatLng().lng], {
            draggable: true,
            icon: this.customIcon,
          }).addTo(this.mapa)
        );

        this.mapa.fitBounds([[res.getLatLng().lat, res.getLatLng().lng]]);
      }
    });
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
    proyecto.latLng =
      this.projectMarker[0].getLatLng().lat +
      ',' +
      this.projectMarker[0].getLatLng().lng;
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
