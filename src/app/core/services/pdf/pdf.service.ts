import { Injectable } from '@angular/core';
import { PdfMethods } from '@core/classes/pdfMethods';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-Italic.ttf'
  }
};

@Injectable({
  providedIn: 'root'
})
export class PdfService extends PdfMethods {

  constructor() {
    super();
  }

  // ====================> createPdf
  public createPdf(docDefinition: any): any {
    return pdfMake.createPdf(docDefinition);
  }

  // ====================> dowload
  public dowload(pdfResult: any, name: string): any {
    return pdfResult.download(name);
  }

  // ====================> open
  public open(pdfResult: any): any {
    return pdfResult.open();
  }

  // ====================> print
  public print(pdfResult: any): any {
    return pdfResult.print();
  }

  // ====================> getPdfDataUrl
  public getPdfDataUrl(pdfResult: any): Promise<string> {
    return new Promise((resolve, reject) => {
      pdfResult.getDataUrl((dataUrl: string) => {
        dataUrl ? resolve(dataUrl) : reject('Ocurriro un error! 🙁')
      });
    });
  }


}
