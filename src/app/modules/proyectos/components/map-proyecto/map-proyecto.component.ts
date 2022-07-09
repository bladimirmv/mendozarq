import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Marker,
  LatLng,
} from './../../../../../../node_modules/@types/leaflet/index.d';
import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { Map, marker, tileLayer, Icon, control, polygon } from 'leaflet';
import * as l from 'leaflet-control-geocoder';
import { type } from 'process';

@Component({
  selector: 'app-map-proyecto',
  templateUrl: './map-proyecto.component.html',
  styleUrls: ['./map-proyecto.component.scss'],
})
export class MapProyectoComponent implements OnInit, AfterViewInit {
  mapa: Map;
  projectMarker: Array<Marker> = [];
  currentMarker = '-17.40199, -66.18258';
  formGroup = new FormGroup({});

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
    @Inject(MAT_DIALOG_DATA)
    public data: { latLng: { lat: number; lng: number } },
    private dialogRef: MatDialogRef<MapProyectoComponent>
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.mapa = new Map('map-proyecto').setView(
      [-17.401848609775207, -66.18253244641603],
      19
    );

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '',
    }).addTo(this.mapa);

    control.scale({ position: 'bottomleft' }).addTo(this.mapa);

    // **Geocoder map ============================================>
    l.geocoder({
      defaultMarkGeocode: false,
      placeholder: 'Buscar...',
      errorMessage: 'No se encontró la dirección',
      iconLabel: '📍',
    })
      .addTo(this.mapa)
      // **On search address ============================================>
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
      marker([this.data.latLng.lat, this.data.latLng.lng], {
        draggable: true,
        title: 'map mendozarq',
        icon: this.customIcon,
      }).addTo(this.mapa)
    );

    this.mapa.fitBounds([[this.data.latLng.lat, this.data.latLng.lng]]);

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

  public saveLocation(): void {
    this.dialogRef.close(this.projectMarker[0]);
  }

  public searchLocation(): void {
    this.projectMarker.forEach((m: Marker, i) => {
      this.mapa.removeLayer(this.projectMarker[i]);
    });
    this.projectMarker = [];

    this.mapa.fitBounds([
      [
        Number(this.currentMarker.split(',')[0]),
        Number(this.currentMarker.split(',')[1]),
      ],
    ]);

    this.projectMarker.push(
      marker(
        [
          Number(this.currentMarker.split(',')[0]),
          Number(this.currentMarker.split(',')[1]),
        ],
        {
          draggable: true,
          icon: this.customIcon,
        }
      ).addTo(this.mapa)
    );
  }
}
