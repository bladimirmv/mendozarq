import { ToastrService } from 'ngx-toastr';
import { OpinionProductoService } from '@services/liraki/opinion-producto.service';
import { OpinionProductoView } from '@app/shared/models/liraki/opinion.producto.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-opinion',
  templateUrl: './edit-opinion.component.html',
  styleUrls: ['./edit-opinion.component.scss'],
})
export class EditOpinionComponent implements OnInit {
  public opinionForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private opinion: OpinionProductoView,
    private _opinionSvc: OpinionProductoService,
    private _toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<EditOpinionComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.opinionForm = this._fb.group({
      estado: [this.opinion?.estado, Validators.required],
      verificado: [this.opinion?.verificado, Validators.required],
      uuid: [this.opinion?.uuid],
    });
  }

  public updateOpinion(opinon: OpinionProductoView): void {
    this._opinionSvc.updateOpinion(opinon).subscribe(() => {
      this._toastrSvc.success(
        '😀 Se ha actualizado correctamente',
        'Opinion Actualizado'
      );
      this.dialogRef.close(true);
    });
  }
}
