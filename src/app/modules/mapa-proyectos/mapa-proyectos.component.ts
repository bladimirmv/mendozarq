import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProyectoView } from './../../shared/models/mendozarq/proyecto.interface';
import { ProyectoService } from '@services/mendozarq/proyecto.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, marker, tileLayer, Icon, control, LatLng, Marker } from 'leaflet';
import * as l from 'leaflet-control-geocoder';
import * as moment from 'moment';

@Component({
  selector: 'app-mapa-proyectos',
  templateUrl: './mapa-proyectos.component.html',
  styleUrls: ['./mapa-proyectos.component.scss'],
})
export class MapaProyectosComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private destroy$ = new Subject<any>();

  public proyectos: Array<ProyectoView> = [];

  // *maps leaflet =====================================================>
  private bounds: Array<Number[]> = [];

  private mapa: Map;
  private projectMarker: Array<Marker> = [];
  private greenIcon = new Icon({
    iconUrl: './assets/green_marker.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  private redIcon = new Icon({
    iconUrl: './assets/red_marker.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  private purpleIcon = new Icon({
    iconUrl: './assets/purple_marker.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  constructor(private proyectoSvc: ProyectoService) {}

  ngOnInit(): void {
    moment().locale('es');
  }
  // =====================> onDestroy
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

    this.getAllProyecto();
  }

  // =====================> getAllProyecto
  getAllProyecto(): void {
    this.proyectoSvc
      .getAllProyecto()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.proyectos = res;
        this.initMarkers();
      });
  }

  initMarkers(): void {
    this.bounds = [];
    this.proyectos.forEach((p, i) => {
      marker([Number(p.latLng.split(',')[0]), Number(p.latLng.split(',')[1])], {
        icon: !p.estado
          ? this.purpleIcon
          : p.porcentaje === 100
          ? this.greenIcon
          : this.redIcon,
      })
        .addTo(this.mapa)
        .bindPopup(
          `
        <h1>${p.nombre}</h1>
        <div><b>Avance:</b> ${p.porcentaje}%</div>
        <div><b>Estado:</b> ${p.estado ? 'Activo' : 'Inactivo'}</div>
        <div><b>Descripcion:</b> ${p.descripcion}</div>
        <div><b>Cliente:</b> ${p.nombreCliente} ${p.apellidoPaterno} ${
            p.apellidoMaterno
          }</div>
        <div><b>Fecha:</b> ${moment(p.fechaInicio).format(
          'DD/MM/YYYY'
        )} - ${moment(p.fechaFinal).format('DD/MM/YYYY')}</div>
        <div><b>Direccion: </b>${p.lugarProyecto}</div>
        <a href="/admin/proyecto/${p.uuid}">Ir al proyecto</a>

        `,

          {
            closeButton: false,
          }
        );
      // .openPopup();

      this.bounds.push([
        Number(p.latLng.split(',')[0]),
        Number(p.latLng.split(',')[1]),
      ]);
    });

    this.mapa.fitBounds(this.bounds as [[number, number]]);
  }

  public onSelectAll(): void {
    this.mapa.fitBounds(this.bounds as [[number, number]]);
  }

  public onSelect(proyecto: ProyectoView): void {
    console.log(proyecto.nombre);
    this.mapa.fitBounds([
      [
        Number(proyecto.latLng.split(',')[0]),
        Number(proyecto.latLng.split(',')[1]),
      ],
    ]);
  }
}
