import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-img-preview',
  templateUrl: './img-preview.component.html',
  styleUrls: ['./img-preview.component.scss']
})
export class ImgPreviewComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public src: string
  ) {
  }

  ngOnInit(): void {
  }

  // getSafeUrl(): void {
  //   this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  // }

}
