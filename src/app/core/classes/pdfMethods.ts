import {
  Proyecto,
  ProyectoView,
} from './../../shared/models/mendozarq/proyecto.interface';
import { Usuario } from './../../shared/models/usuario.interface';
import { DetalleCapitulo } from '@shared/models/mendozarq/presupuestos.interface';
import {
  CapituloPresupuestoView,
  PresupuestoObraView,
} from '@app/shared/models/mendozarq/presupuestos.interface';

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

export type TypeReport = 'usuario' | 'proyecto';

export class PdfMethods {
  constructor() {
    moment.locale('es');
  }

  private toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  private numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  private capitalize(str) {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  public generateQR(pdf, uuid) {
    pdf = {
      qr: uuid ? uuid : 'sin uuid',
      background: '#FFFFFF',
      fit: '70',
    };
  }

  private usuarioTable(pdf: Array<any>, usuario: Array<Usuario>): Array<any> {
    const bodyInfo: Array<BodyTable[]> = [];

    bodyInfo.push([
      {
        text: 'Estado',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Nombre',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Apellidos',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Rol',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Celular',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Correo',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },

      {
        text: 'Nombre de Usuario',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },

      {
        text: 'Direccion',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
    ]);

    usuario.forEach((usuario) => {
      bodyInfo.push([
        {
          text: `${usuario.activo ? 'activo' : 'inactivo'}`,
          alignment: 'justify',
          border: [false, false, false, true],
        },
        {
          text: `${usuario.nombre}`,
          alignment: 'justify',
          border: [false, false, false, true],
        },
        {
          text: `${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${usuario.rol}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${usuario.celular}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${usuario.correo}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${usuario.username}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${usuario.direccion}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
      ]);
    });

    pdf.push(
      this.centerObject({
        style: 'tableExample',
        table: {
          body: bodyInfo,
          alignment: 'center',
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 1 : 1;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 0 : 1;
          },
          hLineColor: function (i, node) {
            return '#425066';
          },
          vLineColor: function (i, node) {
            return '#425066';
          },
        },
      })
    );
    return pdf;
  }

  private proyectoTable(
    pdf: Array<any>,
    proyecto: Array<ProyectoView>
  ): Array<any> {
    const bodyInfo: Array<BodyTable[]> = [];

    bodyInfo.push([
      {
        text: 'Estado',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Nombre',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Cliente',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Categoria',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Fecha Inicio',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Fecha Final',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },

      {
        text: 'Lugar del Proyecto',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },

      {
        text: 'Descripcion',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
    ]);

    proyecto.forEach((data) => {
      bodyInfo.push([
        {
          text: `${data.estado ? 'activo' : 'inactivo'}`,
          alignment: 'justify',
          border: [false, false, false, true],
        },
        {
          text: `${data.nombre}`,
          alignment: 'justify',
          border: [false, false, false, true],
        },
        {
          text: `${data.nombreCliente} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${data.categoria}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${moment(data.fechaInicio).format('DD/MM/YYYY')}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${moment(data.fechaFinal).format('DD/MM/YYYY')}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${data.lugarProyecto}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${data.descripcion}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
      ]);
    });

    pdf.push(
      this.centerObject({
        style: 'tableExample',
        table: {
          body: bodyInfo,
          alignment: 'center',
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 1 : 1;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 0 : 1;
          },
          hLineColor: function (i, node) {
            return '#425066';
          },
          vLineColor: function (i, node) {
            return '#425066';
          },
        },
      })
    );
    return pdf;
  }

  public async reporte<T>(
    pdf: Array<any>,
    data: Array<any>,
    images: Array<string>,
    typeReporte: TypeReport,
    reporteTitle: string
  ): Promise<Array<any>> {
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
          color: '#425066',
        },
        {
          text: moment(new Date()).format('MM/DD/YYYY[,] h:mm A'),
          alignment: 'right',
          margin: [0, 14, 0, 0],
          fontSize: 14,
          color: '#425066',
        },
      ],
    });

    images.forEach((image) => {
      pdf.push({
        image,
        width: 400,
        alignment: 'center',
      });
    });

    pdf.push({
      pageOrientation: 'landscape',
      pageBreak: 'before',
      columns: [
        {
          image: await this.getBase64ImageFromURL('./assets/logo-wave.svg'),
          width: 50,
        },
        {
          text: 'MENDOZARQ',
          margin: [0, 14, 0, 0],
          fontSize: 14,
          color: '#425066',
        },
        {
          text: moment(new Date()).format('MM/DD/YYYY[,] h:mm A'),
          alignment: 'right',
          margin: [0, 14, 0, 0],
          fontSize: 14,
          color: '#425066',
        },
      ],
    });

    pdf.push({
      text: `${reporteTitle}`.toUpperCase(),
      fontSize: 16,
      alignment: 'center',
      bold: true,
      margin: [0, 30, 0, 10],
      tocItem: true,
      tocMargin: [20, 0, 0, 0],
    });

    switch (typeReporte) {
      case 'usuario':
        pdf = this.usuarioTable(pdf, data);
        break;
      case 'proyecto':
        pdf = this.proyectoTable(pdf, data);
        break;
      default:
        break;
    }

    return pdf;
  }

  // ====================> presupuesto
  public async presupuesto(
    pdf: Array<any>,
    presupuesto: PresupuestoObraView,
    capituloPresupuesto: CapituloPresupuestoView[]
  ): Promise<Array<any>> {
    const bodyInfo: Array<BodyTable[]> = [];
    const bodyTable: Array<BodyTable[]> = [];

    pdf = await this.header(pdf, presupuesto);

    bodyInfo.push([
      {
        text: 'Nombre:',
        style: 'tableHeader',
        colSpan: 1,
        color: '#000000',
        bold: true,
        border: [false],
      },
      {
        text: presupuesto.nombre
          ? this.capitalize(presupuesto.nombre)
          : 'Sin nombre',
        style: 'tableHeader',
        color: '#425066',
        colSpan: 1,
        border: [false],
        fontSize: 10,
        margin: [0, 2, 0, 0],
      },

      {
        qr: presupuesto ? presupuesto.uuid : 'sin uuid',
        background: '#FFFFFF',
        foreground: '#425066',
        fit: '65',
        rowSpan: 4,
        border: [false],
      },
    ]);

    bodyInfo.push([
      {
        text: 'Usuario:',
        style: 'tableHeader',
        colSpan: 1,
        color: '#000000',
        bold: true,
        border: [false],
      },
      {
        text: presupuesto.usuario
          ? this.toTitleCase(presupuesto.usuario)
          : 'Sin Usuario',
        style: 'tableHeader',
        colSpan: 1,
        color: '#425066',
        border: [false],
        fontSize: 10,
        margin: [0, 2, 0, 0],
      },
      {},
    ]);
    bodyInfo.push([
      {
        text: 'Cliente:',
        style: 'tableHeader',
        colSpan: 1,
        color: '#000000',
        bold: true,
        border: [false],
      },
      {
        text: presupuesto.cliente
          ? this.toTitleCase(presupuesto.cliente)
          : 'Sin cliente',
        style: 'tableHeader',
        colSpan: 1,
        color: '#425066',
        border: [false],
        fontSize: 10,
        margin: [0, 2, 0, 0],
      },
      {},
    ]);

    bodyInfo.push([
      {
        text: 'Descripción:',
        style: 'tableHeader',
        colSpan: 1,
        color: '#000000',
        bold: true,
        border: [false],
      },
      {
        text: presupuesto.descripcion
          ? this.capitalize(presupuesto.descripcion)
          : 'Sin descripcion',
        style: 'tableHeader',
        colSpan: 1,
        color: '#425066',
        border: [false],
        fontSize: 10,
        margin: [0, 2, 0, 0],
      },
      {},
    ]);

    // *data
    pdf.push({
      style: 'tableExample',
      margin: [0, 10, 0, 0],
      table: {
        body: bodyInfo,
        alignment: 'center',
        widths: ['auto', '*', 'auto'],
      },
      layout: {
        hLineWidth: function (i, node) {
          return i === 0 || i === node.table.body.length ? 1 : 1;
        },
        vLineWidth: function (i, node) {
          return i === 0 || i === node.table.widths.length ? 1 : 1;
        },
        hLineColor: function (i, node) {
          return '#425066';
        },
        vLineColor: function (i, node) {
          return '#425066';
        },
      },
    });

    // *title
    pdf.push({
      text: 'Presupuesto de Obra'.toUpperCase(),
      fontSize: 16,
      alignment: 'center',
      bold: true,
      margin: [0, 20, 0, 10],
      tocItem: true,
    });

    // *header table
    bodyTable.push([
      {
        text: 'DESCRIPCIÓN',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'PRECIO',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: '% DTO.',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'PRECIO DTO.',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'TOTAL',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
    ]);

    capituloPresupuesto.forEach((capitulo: CapituloPresupuestoView) => {
      bodyTable.push([
        {
          text: `${capitulo.nombre}`,
          alignment: 'justify',
          border: [false, false, false, true],
        },
        {
          text: `${capitulo.total}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${capitulo.descuento}%`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${capitulo.totalDescuento}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${capitulo.total != 0 ? capitulo.total : 0}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
      ]);
    });

    // *results
    bodyTable.push([
      {
        text: '',
        border: [false],
      },
      {
        text: '',
        border: [false],
      },
      {
        text: 'TOTAL BRUTO',
        colSpan: 2,
        border: [false, false, false, false],

        color: '#ffffff',
        fillColor: '#425066',
        alignment: 'center',
        bold: true,
      },
      {},
      {
        text: `${
          presupuesto
            ? this.numberWithCommas(presupuesto.totalBruto.toLocaleString())
            : 0
        }`,
        colSpan: 1,
        border: [false],

        alignment: 'center',
        color: '#000000',
        // fillColor: '#F5F5F5',
      },
    ]);

    bodyTable.push([
      {
        text: '',
        border: [false],
      },
      {
        text: '',
        border: [false],
      },
      {
        text: 'I.V.A.',
        colSpan: 1,
        border: [false],
        color: '#000000',
        fillColor: '#F5F5F5',
        bold: true,
        alignment: 'center',
      },
      {
        text: `${presupuesto ? presupuesto.iva : 0}%`,
        colSpan: 1,
        border: [false],
        alignment: 'center',
        color: '#000000',
        fillColor: '#F5F5F5',
      },
      {
        text: `${
          presupuesto
            ? this.numberWithCommas(presupuesto.totalWithIVA.toLocaleString())
            : 0
        }`,
        colSpan: 1,
        border: [false],

        color: '#000000',
        // fillColor: '#F5F5F5',
        alignment: 'center',
      },
    ]);

    bodyTable.push([
      {
        text: '',
        border: [false],
      },
      {
        text: '',
        border: [false],
      },
      {
        text: 'TOTAL',
        colSpan: 2,
        border: [false, false, false, false],

        color: '#ffffff',
        fillColor: '#FF6E00',
        alignment: 'center',
        bold: true,
      },
      {},
      {
        text: `${
          presupuesto
            ? this.numberWithCommas(
                presupuesto.totalPresupuesto.toLocaleString()
              )
            : 0
        }`,
        colSpan: 1,
        border: [false],

        color: '#000000',
        // fillColor: '#F5F5F5',
        alignment: 'center',
      },
    ]);

    pdf.push(
      this.centerObject({
        style: 'tableExample',
        table: {
          body: bodyTable,
          alignment: 'center',
          widths: ['*', 'auto', 50, 70, 'auto'],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 1 : 1;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 0 : 1;
          },
          hLineColor: function (i, node) {
            return '#425066';
          },
          vLineColor: function (i, node) {
            return '#425066';
          },
        },
      })
    );

    pdf = this.pageBreak(pdf);

    return pdf;
  }

  // ====================> detallePresupuesto
  public async detallePresupuesto(
    pdf: Array<any>,
    presupuesto: PresupuestoObraView,
    capituloPresupuesto: CapituloPresupuestoView[]
  ): Promise<Array<any>> {
    const bodyTable: Array<BodyTable[]> = [];

    pdf = await this.header(pdf, presupuesto);

    pdf.push({
      text: 'Detalle del Presupuesto'.toUpperCase(),
      fontSize: 16,
      alignment: 'center',
      bold: true,
      margin: [0, 30, 0, 10],
      tocItem: true,
      tocMargin: [20, 0, 0, 0],
    });

    // *Header
    bodyTable.push([
      {
        text: 'Nro.',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'DENOMINACIÓN',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Un.',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'CANT.',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'P.U.',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'TOTAL',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
    ]);

    capituloPresupuesto.forEach(
      (capitulo: CapituloPresupuestoView, capIndex: number) => {
        bodyTable.push([
          {
            text: `${capIndex + 1}`,
            style: 'tableHeader',
            colSpan: 1,
            alignment: 'center',
            fillColor: '#F5F5F5',
            bold: true,
            border: [false, false, false, false],
          },
          {
            text: `${capitulo.nombre}`,
            style: 'tableHeader',
            colSpan: 4,
            alignment: 'center',
            fillColor: '#F5F5F5',
            bold: true,
            border: [false, false, false, false],
          },
          {},
          {},
          {},
          {
            text: `${capitulo.total}`,
            style: 'tableHeader',
            colSpan: 1,
            alignment: 'center',
            // color: '#ffffff',
            fillColor: '#F5F5F5',
            bold: true,
            border: [false, false, false, false],
          },
        ]);

        capitulo.detalles.forEach(
          (detalle: DetalleCapitulo, detalleIndex: number) => {
            bodyTable.push([
              {
                text: `${capIndex + 1}.${detalleIndex + 1}`,
                alignment: 'center',
                border: [false, false, false, true],
              },
              {
                text: `${detalle.descripcion}`,
                alignment: 'justify',
                border: [false, false, false, true],
              },
              {
                text: `${detalle.unidad}`,
                alignment: 'center',
                border: [false, false, false, true],
              },
              {
                text: `${detalle.cantidad}`,
                alignment: 'center',
                border: [false, false, false, true],
              },
              {
                text: `${detalle.precioUnitario}`,
                alignment: 'center',
                border: [false, false, false, true],
              },
              {
                text: `${detalle.precioUnitario * detalle.cantidad}`,
                alignment: 'center',
                border: [false, false, false, true],
              },
            ]);
          }
        );
      }
    );

    // *items
    pdf.push(
      this.centerObject({
        style: 'tableExample',
        table: {
          body: bodyTable,
          alignment: 'center',
          widths: ['auto', '*', 30, 'auto', 'auto', 'auto'],
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 1 : 1;
          },
          vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 0 : 1;
          },
          hLineColor: function (i, node) {
            return '#425066';
          },
          vLineColor: function (i, node) {
            return '#425066';
          },
        },
      })
    );

    return pdf;
  }

  // ====================> header
  public pageBreak(pdf: any): Array<any> {
    pdf.push({
      text: '',
      pageBreak: 'after',
    });
    return pdf;
  }

  // ====================> header
  public async header(
    pdf: any,
    presupuesto: PresupuestoObraView
  ): Promise<Array<any>> {
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
          color: '#425066',
        },
        {
          text: moment(presupuesto ? presupuesto.creadoEn : '')
            .format('MM/DD/YYYY[,] h:mm A')
            .toUpperCase(),
          alignment: 'right',
          margin: [0, 14, 0, 0],
          fontSize: 14,
          color: '#425066',
        },
      ],
    });
    return pdf;
  }

  // ====================> centerObject
  public centerObject(data: any): { columns: Array<any> } {
    data.width = 'auto';
    return {
      columns: [{ width: '*', text: '' }, data, { width: '*', text: '' }],
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
        img.onerror = (err) => {
          reject(err);
        };
      } else {
        resolve(this.getBase64Image(img));
      }
    });
  }
}
