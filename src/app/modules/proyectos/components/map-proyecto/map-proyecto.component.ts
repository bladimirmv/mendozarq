import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Marker } from './../../../../../../node_modules/@types/leaflet/index.d';
import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { Map, marker, tileLayer, Icon } from 'leaflet';

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
    @Inject(MAT_DIALOG_DATA) public latLng: any,
    private dialogRef: MatDialogRef<MapProyectoComponent>
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.mapa = new Map('map-proyecto').setView([-17.40199, -66.18258], 18);

    tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

      {
        maxZoom: 19,
        attribution: '',
      }
    ).addTo(this.mapa);

    this.projectMarker.push(
      marker([this.latLng.lat, this.latLng.lng], {
        draggable: true,
        title: 'titulo',
        icon: this.customIcon,
      }).addTo(this.mapa)
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
