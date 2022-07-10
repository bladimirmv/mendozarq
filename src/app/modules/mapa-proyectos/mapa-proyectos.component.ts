import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProyectoView } from './../../shared/models/mendozarq/proyecto.interface';
import { ProyectoService } from '@services/mendozarq/proyecto.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, marker, tileLayer, Icon, control, LatLng, Marker } from 'leaflet';
import * as l from 'leaflet-control-geocoder';

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
  constructor(private proyectoSvc: ProyectoService) {}

  ngOnInit(): void {}
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

    // **Geocoder map ============================================>
    // l.geocoder({
    //   defaultMarkGeocode: false,
    //   placeholder: 'Buscar...',
    //   errorMessage: 'No se encontró la dirección',
    //   iconLabel: '📍',
    //   suggestMinLength: 10,
    // })
    //   .addTo(this.mapa)
    //   .on('markgeocode', (e) => {
    //     this.projectMarker.forEach((m: Marker, i) => {
    //       this.mapa.removeLayer(this.projectMarker[i]);
    //     });

    //     this.projectMarker = [];

    //     this.projectMarker.push(
    //       marker([e.geocode.center.lat, e.geocode.center.lng], {
    //         draggable: true,
    //         icon: this.customIcon,
    //       })
    //         .addTo(this.mapa)
    //         .bindPopup(e.geocode.name, {
    //           closeOnClick: false,
    //           autoClose: false,
    //           closeButton: false,
    //         })
    //         .openPopup()
    //     );

    //     const bbox = e.geocode.bbox;
    //     this.mapa.fitBounds([
    //       [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
    //       [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
    //       [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
    //       [bbox.getSouthWest().lat, bbox.getSouthWest().lng],
    //     ]);
    //   });

    // this.projectMarker.push(
    //   marker([-17.40199, -66.18258], {
    //     draggable: true,
    //     title: 'map mendozarq',
    //     icon: this.customIcon,
    //   }).addTo(this.mapa)
    // );

    // this.mapa.fitBounds([
    //   [
    //     this.projectMarker[0].getLatLng().lat,
    //     this.projectMarker[0].getLatLng().lng,
    //   ],
    // ]);

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
    let bounds: Array<Number[]> = [];

    this.proyectos.forEach((p, i) => {
      marker([Number(p.latLng.split(',')[0]), Number(p.latLng.split(',')[1])], {
        icon: this.customIcon,
      })
        .addTo(this.mapa)
        .bindPopup(
          `
        <h1>${p.nombre}</h1>
        <div><b>Descripcion:</b> ${p.descripcion}</div>
        <div><b>Avance:</b> ${p.porcentaje}%</div>
        <div><b>Cliente:</b> ${p.nombreCliente} ${p.apellidoPaterno} ${p.apellidoMaterno}</div>
        <div><b>Avance:</b> ${p.fechaInicio}%</div>
        <div><b>Direccion: </b>${p.lugarProyecto}</div>`,

          {
            closeButton: false,
          }
        );

      bounds.push([
        Number(p.latLng.split(',')[0]),
        Number(p.latLng.split(',')[1]),
      ]);
    });

    this.mapa.fitBounds(bounds as [[number, number]]);
  }
}
