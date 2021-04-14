import { Component, OnInit } from '@angular/core';
import { PdfService } from '@services/pdf/pdf.service';
@Component({
  selector: 'app-presupuesto-obra',
  templateUrl: './presupuesto-obra.component.html',
  styleUrls: ['./presupuesto-obra.component.scss']
})
export class PresupuestoObraComponent implements OnInit {

  public pdfResult: any;

  constructor(private pdfSvc: PdfService) { }

  ngOnInit(): void {
    this.generatePdf();
  }

  // ====================> generatePdf
  private async generatePdf(): Promise<void> {
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

    this.pdfResult = this.pdfSvc.createPdf(docDefinition);

    const pdfIframe = document.querySelector('#pdf-iframe') as HTMLIFrameElement;
    pdfIframe.src = await this.pdfSvc.getPdfDataUrl(this.pdfResult);
  }

  // ====================> downloadPdf
  public downloadPdf(): void {
    if (this.pdfResult) {
      this.pdfSvc.dowload(this.pdfResult, 'presupuesto_123');
    }
  }

  // ====================> openPdf
  public openPdf(): void {
    if (this.pdfResult) {
      this.pdfSvc.open(this.pdfResult);
    }
  }

  // ====================> printPdf
  public printPdf(): void {
    if (this.pdfResult) {
      this.pdfSvc.print(this.pdfResult);
    }
  }

}
