import * as moment from 'moment';
export interface BodyTable {
  text?: string;
  style?: 'tableHeader';
  colSpan?: number;
  rowSpan?: number;
  alignment?: 'center' | 'justify' | 'right';
  color?: string;
  fillColor?: string;
  border?: Array<boolean>;
  bold?: true;
  margin?: Array<number>;
  fontSize?: number;
  italics?: boolean;
  qr?: string;
  foreground?: string;
  background?: string;
  fit?: string;
}


export class PdfMethods {

  constructor() {
    moment.locale('es');
  }



  // ====================> presupuesto
  public async presupuesto(pdf: Array<any>): Promise<Array<any>> {
    const bodyInfo: Array<BodyTable[]> = [];
    const bodyTable: Array<BodyTable[]> = [];

    pdf = await this.header(pdf);

    bodyInfo.push([{
      text: 'Nombre:',
      style: 'tableHeader',
      colSpan: 1,
      color: '#000000',
      bold: true,
      border: [false]
    },
    {
      text: 'Edificio Morales',
      style: 'tableHeader',
      color: '#425066',
      colSpan: 1,
      border: [false],
      fontSize: 10,
      margin: [0, 2, 0, 0]
    },

    {
      qr: 'text in QR',
      background: '#FFFFFF',
      foreground: '#425066',
      fit: '65',
      rowSpan: 3,
      border: [false]

    }]);

    bodyInfo.push([{
      text: 'Cliente:',
      style: 'tableHeader',
      colSpan: 1,
      color: '#000000',
      bold: true,
      border: [false]

    },
    {
      text: 'Baldimir Medrano Vargas',
      style: 'tableHeader',
      colSpan: 1,
      color: '#425066',
      border: [false],
      fontSize: 10,
      margin: [0, 2, 0, 0]

    },
    {

    }]);

    bodyInfo.push([{
      text: 'Descripción:',
      style: 'tableHeader',
      colSpan: 1,
      color: '#000000',
      bold: true,
      border: [false]
    },
    {
      text: 'Presupuesto de obra para el edificio morales ',
      style: 'tableHeader',
      colSpan: 1,
      color: '#425066',
      border: [false],
      fontSize: 10,
      margin: [0, 2, 0, 0]
    },
    {

    }]);

    // *data
    pdf.push({
      style: 'tableExample',
      margin: [0, 10, 0, 0],
      table: {
        body: bodyInfo,
        alignment: 'center',
        widths: ['auto', '*', 'auto']
      },
      layout: {
        hLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 1 : 1;
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 1 : 1;
        },
        hLineColor: function (i, node) {
          return '#425066';
        },
        vLineColor: function (i, node) {
          return '#425066';
        }
      }
    });

    // *title
    pdf.push({
      text: 'Presupuesto de Obra'.toUpperCase(),
      fontSize: 16,
      alignment: 'center',
      bold: true,
      margin: [0, 20, 0, 10],
      tocItem: true
    });

    // *header table
    bodyTable.push([{
      text: 'DESCRIPCIÓN',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#FF6E00',
      bold: true,
      border: [false, false, false, false]
    }, {
      text: 'PRECIO',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#FF6E00',
      bold: true,
      border: [false, false, false, false]

    }, {
      text: '% DTO.',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#FF6E00',
      bold: true,
      border: [false, false, false, false]

    }, {
      text: 'PRECIO DTO.',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#FF6E00',
      bold: true,
      border: [false, false, false, false]

    }, {
      text: 'TOTAL',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#FF6E00',
      bold: true,
      border: [false, false, false, false]

    }]);

    bodyTable.push([
      {
        text: 'Estructura de Hormigón - Piso de Hormigón das das das dsdf das fg dsf adsfds fdsafa dsf affads',
        alignment: 'justify',
        border: [false, false, false, true]
      }, {
        text: '2,390.000',
        alignment: 'center',
        border: [false, false, false, true]
      }, {
        text: '0%',
        alignment: 'center',
        border: [false, false, false, true]
      }, {
        text: '2,390.000.00',
        alignment: 'center',
        border: [false, false, false, true]
      }, {
        text: '300000',
        alignment: 'center',
        border: [false, false, false, true]
      }
    ]);

    // *results
    bodyTable.push([
      {
        text: '',
        border: [false],

      }, {
        text: '',
        border: [false],

      }, {
        text: 'TOTAL BRUTO',
        colSpan: 2,
        border: [false, false, false, false],

        color: '#ffffff',
        fillColor: '#425066',
        alignment: 'center',
        bold: true,


      }, {}, {
        text: '7,653',
        colSpan: 1,
        border: [false],

        alignment: 'center',
        color: '#000000',
        // fillColor: '#F5F5F5',
      }
    ]);

    bodyTable.push([
      {
        text: '',
        border: [false],

      }, {
        text: '',
        border: [false],

      }, {
        text: 'I.V.A.',
        colSpan: 1,
        border: [false],
        color: '#000000',
        fillColor: '#F5F5F5',
        bold: true,
        alignment: 'center',

      }, {
        text: '21%',
        colSpan: 1,
        border: [false],
        alignment: 'center',
        color: '#000000',
        fillColor: '#F5F5F5',
      }, {
        text: '7,653',
        colSpan: 1,
        border: [false],

        color: '#000000',
        // fillColor: '#F5F5F5',
        alignment: 'center',

      }
    ]);

    bodyTable.push([
      {
        text: '',
        border: [false],

      }, {
        text: '',
        border: [false],

      }, {
        text: 'TOTAL',
        colSpan: 2,
        border: [false, false, false, false],


        color: '#ffffff',
        fillColor: '#FF6E00',
        alignment: 'center',
        bold: true,

      }, {}, {
        text: '7,653',
        colSpan: 1,
        border: [false],

        color: '#000000',
        // fillColor: '#F5F5F5',
        alignment: 'center',

      }
    ]);

    pdf.push(this.centerObject({
      style: 'tableExample',
      table: {
        body: bodyTable,
        alignment: 'center',
        widths: ['*', 'auto', 50, 70, 'auto']
      },
      layout: {
        hLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 1 : 1;
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 0 : 1;
        },
        hLineColor: function (i, node) {
          return '#425066';
        },
        vLineColor: function (i, node) {
          return '#425066';
        }
      }
    }));

    pdf = this.pageBreak(pdf);

    return pdf;
  }

  // ====================> detallePresupuesto
  public async detallePresupuesto(pdf: Array<any>): Promise<Array<any>> {

    const bodyTable: Array<BodyTable[]> = [];

    pdf = await this.header(pdf);

    pdf.push({
      text: 'Detalle del Presupuesto'.toUpperCase(),
      fontSize: 16,
      alignment: 'center',
      bold: true,
      margin: [0, 30, 0, 10],
      tocItem: true,
      tocMargin: [20, 0, 0, 0]
    })

    // *Header
    bodyTable.push([{
      text: 'Nro.',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#FF6E00',
      bold: true,
      border: [false, false, false, false]
    }, {
      text: 'DENOMINACIÓN',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#FF6E00',
      bold: true,
      border: [false, false, false, false]


    }, {
      text: 'Un.',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#FF6E00',
      bold: true,
      border: [false, false, false, false]


    }, {
      text: 'CANT.',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#FF6E00',
      bold: true,
      border: [false, false, false, false]


    }, {
      text: 'P.U.',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#FF6E00',
      bold: true,
      border: [false, false, false, false]


    }, {
      text: 'TOTAL',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#FF6E00',
      bold: true,
      border: [false, false, false, false]


    }]);

    // *items
    bodyTable.push([{
      text: '1',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      fillColor: '#F5F5F5',
      bold: true,
      border: [false, false, false, false]

    }, {
      text: 'Demoliciones',
      style: 'tableHeader',
      colSpan: 4,
      alignment: 'center',
      // color: '#ffffff',
      fillColor: '#F5F5F5',
      bold: true,
      border: [false, false, false, false]


    }, {}, {}, {}, {
      text: '2,390.00',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      // color: '#ffffff',
      fillColor: '#F5F5F5',
      bold: true,
      border: [false, false, false, false]


    }]);

    bodyTable.push([
      {
        text: '1.1',
        alignment: 'center',
        border: [false, false, false, true]
      }, {
        text: 'Cerramiento de aislaci del sector (estructura tubular + film pe. 200mc.)30,00X4,50',
        alignment: 'justify',
        border: [false, false, false, true]
      }, {
        text: 'gl',
        alignment: 'center',
        border: [false, false, false, true]
      }, {
        text: '1',
        alignment: 'center',
        border: [false, false, false, true]
      }, {
        text: '300000',
        alignment: 'center',
        border: [false, false, false, true]
      }, {
        text: '300000',
        alignment: 'center',
        border: [false, false, false, true]
      }
    ]);

    pdf.push(this.centerObject({
      style: 'tableExample',
      table: {
        body: bodyTable,
        alignment: 'center',
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto']
      },
      layout: {
        hLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 1 : 1;
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 0 : 1;
        },
        hLineColor: function (i, node) {
          return '#425066';
        },
        vLineColor: function (i, node) {
          return '#425066';
        }
      }
    }));

    return pdf;

  }

  // ====================> header
  public pageBreak(pdf: any): Array<any> {
    pdf.push({
      text: '',
      pageBreak: 'after'
    });
    return pdf;
  }

  // ====================> header
  public async header(pdf: any): Promise<Array<any>> {
    pdf.push({
      columns: [
        {
          image: await this.getBase64ImageFromURL('./assets/logo-wave.svg'),
          width: 50
        },
        {
          text: 'MENDOZARQ',
          margin: [0, 14, 0, 0],
          fontSize: 14,
          color: '#425066'
        },
        {
          text: moment().format('MMMM/DD/YYYY').toUpperCase(),
          alignment: 'right',
          margin: [0, 14, 0, 0],
          fontSize: 14,
          color: '#425066'
        }
      ]
    });
    return pdf;
  }

  // ====================> centerObject
  public centerObject(data: any): { columns: Array<any> } {
    data.width = 'auto';
    return {
      columns: [
        { width: '*', text: '' },
        data,
        { width: '*', text: '' },
      ]
    };

  }

  // ====================> getBase64Image
  public getBase64Image(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
  }

  // ====================> getBase64ImageFromURL
  public getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          resolve(this.getBase64Image(img));
        };
        img.onerror = err => {
          reject(err);
        };
      } else {
        resolve(this.getBase64Image(img));
      }
    });
  }
}
