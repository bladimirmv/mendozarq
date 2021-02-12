import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentoProyecto } from '@app/shared/models/mendozarq/documentos.proyecto.interface';
import { EditDocumentoComponent } from '../edit-documento/edit-documento.component';

@Component({
  selector: 'app-info-documento',
  templateUrl: './info-documento.component.html',
  styleUrls: ['./info-documento.component.scss']
})
export class InfoDocumentoComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<EditDocumentoComponent>,
    @Inject(MAT_DIALOG_DATA) public documentoProyecto: DocumentoProyecto
  ) { }

  ngOnInit(): void {
  }

}
