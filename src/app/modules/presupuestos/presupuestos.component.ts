import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { PdfService } from '@services/pdf/pdf.service';
import * as moment from 'moment';


@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.scss']
})
export class PresupuestosComponent implements OnInit {

  public pdfDataUrl: string;
  constructor(private pdfSvc: PdfService) { }

  async ngOnInit(): Promise<void> {



    let pdf: Array<any> = [];


    pdf = await this.pdfSvc.presupuesto(pdf);
    pdf = await this.pdfSvc.detallePresupuesto(pdf);




    const docDefinition = {
      content: pdf,
      watermark: { text: '©MENDOZARQ', color: '#FF6E00', opacity: 0.06, bold: true, italics: false, },
      info: {
        title: 'Presupuestos',
        author: '©MENDOZARQ'
      },
      pageMargins: [60, 40, 40, 60],
      pageSize: 'letter',
      defaultStyle: {
        font: 'Roboto'
      },
      footer: (currentPage, pageCount) => {
        if (currentPage) {
          return {
            fontSize: 10,
            text: `Pagina ${currentPage} de ${pageCount}`,
            alignment: 'center',
            margin: [0, 20, 0, 0],
            color: '#425066'
          };
        }
      }

    };



    const pdfResult = this.pdfSvc.createPdf(docDefinition);
    this.pdfDataUrl = await this.pdfSvc.getPdfDataUrl(pdfResult);

    const pdfIframe = document.querySelector('#pdf-iframe') as HTMLIFrameElement;
    pdfIframe.src = this.pdfDataUrl;
  }





}
