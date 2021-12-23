import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DocumentoProyecto } from '@app/shared/models/mendozarq/documentos.proyecto.interface';
import { EditDocumentoComponent } from '../edit-documento/edit-documento.component';

import * as moment from 'moment';

@Component({
  selector: 'app-info-documento',
  templateUrl: './info-documento.component.html',
  styleUrls: ['./info-documento.component.scss'],
})
export class InfoDocumentoComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<EditDocumentoComponent>,
    @Inject(MAT_DIALOG_DATA) public documentoProyecto: DocumentoProyecto
  ) {}

  ngOnInit(): void {
    moment.locale('es');
  }

  getTime(date: Date): string {
    return moment(date).format('LLLL');
  }

  // =====================> trimExtension
  public trimExtension(nombre: string): string {
    return nombre.split('.').slice(0, -1).join('.');
  }

  // =====================> getType
  public getType(nombre: string): string {
    const arrayName = nombre.split('.');
    return arrayName[arrayName.length - 1];
  }
  // ======================== formatBytes
  public formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
