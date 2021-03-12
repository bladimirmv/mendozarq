import * as moment from 'moment';
export interface BodyTable {
  text?: string;
  style?: 'tableHeader';
  colSpan?: number;
  alignment?: 'center' | 'justify' | 'right';
  color?: string;
  fillColor?: string;
  border?: Array<boolean>;
  bold?: true;
  margin?: Array<number>;
  fontSize?: number;
  italics?: boolean;
}

// export interface ItemTable extends Table {
//   margin?: Array<number>;
// }


export class PdfMethods {

  constructor() {
    moment.locale('es');
  }


  // ====================> presupuesto
  public async presupuesto(pdf: Array<any>): Promise<Array<any>> {

    const bodyTable: Array<BodyTable[]> = [];

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

    pdf.push({
      text: 'Presupuesto de Obra'.toUpperCase(),
      fontSize: 16,
      alignment: 'center',
      bold: true,
      margin: [0, 30, 0, 10],
      tocItem: true,
      tocMargin: [20, 0, 0, 0]
    });

    // *header
    bodyTable.push([{
      text: 'DESCRIPCIÓN',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#1D7EFF',
      bold: true,
      border: [false, true, false, true]
    }, {
      text: 'PRECIO',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#1D7EFF',
      bold: true,
      border: [false, true, false, true]

    }, {
      text: '% DTO.',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#1D7EFF',
      bold: true,
      border: [false, true, false, true]

    }, {
      text: 'PRECIO DTO.',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#1D7EFF',
      bold: true,
      border: [false, true, false, true]

    }, {
      text: 'TOTAL',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#1D7EFF',
      bold: true,
      border: [false, true, false, true]

    }]);

    bodyTable.push([
      {
        text: 'Estructura de Hormigón - Piso de Hormigón das das das dsdf das fg dsf adsfds fdsafa dsf affads',
        alignment: 'justify',

        border: [false, true, false, true]

      }, {
        text: '2,390.000',
        alignment: 'center',
        border: [false, true, false, true]

      }, {
        text: '0%',
        alignment: 'center',

        border: [false, true, false, true]


      }, {
        text: '2,390.000.00',
        alignment: 'center',
        border: [false, true, false, true]


      }, {
        text: '300000',
        alignment: 'center',

        border: [false, true, false, true]


      }
    ]);

    // *Results
    bodyTable.push([
      {
        text: '',
        border: [false, false, false, false]
      }, {
        text: '',
        border: [false, false, false, false]
      }, {
        text: 'TOTAL BRUTO',
        colSpan: 2,
        border: [false, true, false, true],
        color: '#000000',
        fillColor: '#FFCA2A',
        alignment: 'center'

      }, {}, {
        text: '7,653',
        colSpan: 1,
        border: [false, true, false, true],
        alignment: 'center',
        color: '#000000',
        fillColor: '#FFFFFF',
      }
    ]);

    bodyTable.push([
      {
        text: '',
        border: [false, false, false, false]
      }, {
        text: '',
        border: [false, false, false, false]
      }, {
        text: 'I.V.A. %',
        colSpan: 1,
        border: [false, true, false, true],
        color: '#000000',
        fillColor: '#FFCA2A',
        alignment: 'right',

      }, {
        text: '21%',
        colSpan: 1,
        border: [false, true, false, true],
        alignment: 'center',
        color: '#000000',
        fillColor: '#F2F2F2',
      }, {
        text: '7,653',
        colSpan: 1,
        border: [false, true, false, true],
        color: '#000000',
        fillColor: '#FFFFFF',
        alignment: 'center',

      }
    ]);

    bodyTable.push([
      {
        text: '',
        border: [false, false, false, false]
      }, {
        text: '',
        border: [false, false, false, false]
      }, {
        text: 'TOTAL',
        colSpan: 2,
        border: [false, true, false, true],
        color: '#FFFFFF',
        fillColor: '#1D7EFF',
        alignment: 'center'
      }, {}, {
        text: '7,653',
        colSpan: 1,
        border: [false, true, false, true],
        color: '#000000',
        fillColor: '#FFFFFF',
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
          return '#000000';
        },
        vLineColor: function (i, node) {
          return '#000000';
        }
      }
    }));

    return pdf;
  }


  // ====================> detallePresupuesto
  public async detallePresupuesto(pdf: Array<any>): Promise<Array<any>> {

    const bodyTable: Array<BodyTable[]> = [];

    pdf.push({
      columns: [
        {
          image: await this.getBase64ImageFromURL('./assets/logo-wave.svg'),
          width: 50,
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
          color: '#425066',
          fontSize: 14
        }
      ],
      pageBreak: 'before'
    });

    pdf.push({
      text: 'Detalle del Presupuesto'.toUpperCase(),
      fontSize: 16,
      alignment: 'center',
      bold: true,
      margin: [0, 30, 0, 10],
      tocItem: true,
      tocMargin: [20, 0, 0, 0]
    })

    bodyTable.push([{
      text: 'Nro.',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#1D7EFF',
      bold: true,
      border: [false, true, false, true]
    }, {
      text: 'DENOMINACIÓN',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#1D7EFF',
      bold: true,
      border: [false, true, false, true]

    }, {
      text: 'Un.',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#1D7EFF',
      bold: true,
      border: [false, true, false, true]

    }, {
      text: 'CANT.',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#1D7EFF',
      bold: true,
      border: [false, true, false, true]

    }, {
      text: 'P.U.',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#1D7EFF',
      bold: true,
      border: [false, true, false, true]

    }, {
      text: 'TOTAL',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#FFFFFF',
      fillColor: '#1D7EFF',
      bold: true,
      border: [false, true, false, true]

    }]);

    bodyTable.push([{
      text: '1',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#000000',
      fillColor: '#FFCA2A',
      bold: true,
      border: [false, true, false, true]

    }, {
      text: 'Demoliciones',
      style: 'tableHeader',
      colSpan: 4,
      alignment: 'center',
      color: '#000000',
      fillColor: '#FFCA2A',
      bold: true,
      border: [false, true, false, true]


    }, {}, {}, {}, {
      text: '2,390.00',
      style: 'tableHeader',
      colSpan: 1,
      alignment: 'center',
      color: '#000000',
      fillColor: '#FFCA2A',
      bold: true,
      border: [false, true, false, true]


    }]);

    bodyTable.push([
      {
        text: '1.1',
        alignment: 'center',

        border: [false, true, false, true]

      }, {
        text: 'Cerramiento de aislaci del sector (estructura tubular + film pe. 200mc.)30,00X4,50',
        alignment: 'justify',
        border: [false, true, false, true]

      }, {
        text: 'gl',
        alignment: 'center',

        border: [false, true, false, true]


      }, {
        text: '1',
        alignment: 'center',
        border: [false, true, false, true]


      }, {
        text: '300000',
        alignment: 'center',

        border: [false, true, false, true]


      }, {
        text: '300000',
        alignment: 'center',

        border: [false, true, false, true]

      }
    ])

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
          return '#000000';
        },
        vLineColor: function (i, node) {
          return '#000000';
        }
      }
    }));

    return pdf;
  }

  // ====================> centerColumn
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
