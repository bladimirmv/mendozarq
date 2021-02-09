import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentosService } from '@app/core/services/mendozarq/documentos.service';

import { DocumentoProyecto } from '@models/mendozarq/documentos.proyecto.interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-new-documento',
  templateUrl: './new-documento.component.html',
  styleUrls: ['./new-documento.component.scss']
})
export class NewDocumentoComponent implements OnInit {

  private destroy$ = new Subject<any>();
  public documentoForm: FormGroup;

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  constructor(
    private documentosSvc: DocumentosService,
    @Inject(MAT_DIALOG_DATA) public uuidProyecto: string,
    private fb: FormBuilder

  ) { }


  ngOnInit(): void {
    // this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }


  // =====================> onInitForm
  private initForm(): void {
    this.documentoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(4), Validators.pattern(/^[0-9a-z\s]+$/)]]
    });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress.percentage = 0;

    this.currentFileUpload = this.selectedFiles.item(0);

    const documento: DocumentoProyecto = {
      nombre: 'doc12ss2sss',
      fechaCreacion: new Date,
      uuidProyecto: this.uuidProyecto
    }


    this.documentosSvc.addDocument(documento, this.currentFileUpload)
      .subscribe(event => {

        if (event.type === HttpEventType.UploadProgress) {
          console.log('si es uploadProgress');
          console.log(event);

          this.progress.percentage = Math.round(100 * event.loaded / event.total);
          console.log('fin');



        } else if (event instanceof HttpResponse) {

          console.log('event', event);

          console.log('File is completely uploaded!');
        }


      });

    this.selectedFiles = undefined;
  }

}
