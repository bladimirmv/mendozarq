import {
  PlanificacionProyectoView,
  CapituloPlanificacionProyecto,
} from './../../shared/models/charts/planificacion.interface';
import { async } from '@angular/core/testing';
import { VisitaProyecto } from './../../shared/models/mendozarq/visita.proyecto.interface';
import { ObservacionObraView } from './../../shared/models/mendozarq/observacion.obra.interface';
import { OpinionProductoView } from '@app/shared/models/liraki/opinion.producto.interface';
import { ProductoView } from '@app/shared/models/liraki/producto.interface';
import { Producto } from '@models/liraki/producto.interface';
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
import { VentaView } from '@app/shared/models/liraki/venta.interface';
import { environment } from '@env/environment';
export interface BodyTable {
  text?: string;
  style?: 'tableHeader';
  colSpan?: number;
  rowSpan?: number;
  alignment?: 'center' | 'justify' | 'right';
  color?: string;
  fillColor?: string;
  border?: Array<boolean>;
  bold?: boolean;
  margin?: Array<number>;
  fontSize?: number;
  italics?: boolean;
  qr?: string;
  foreground?: string;
  background?: string;
  fit?: string;
  stack?: Array<any>;
  image?: any;
  width?: any;
}

export type TypeReport =
  | 'usuario'
  | 'proyecto'
  | 'producto'
  | 'pedidos'
  | 'venta'
  | 'opiniones'
  | 'ventas';

export class PdfMethods {
  private API_URL = environment.API_URL;

  constructor() {
    moment.locale('es');
  }

  public getImage(keyName: string): string {
    return `${this.API_URL}/api/file/${keyName}`;
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

  private productoTable(
    pdf: Array<any>,
    producto: Array<ProductoView>
  ): Array<any> {
    const bodyInfo: Array<BodyTable[]> = [];

    producto.forEach((data, index) => {
      const categories: Array<string> = data.categorias.map(
        (cat) => cat.nombre
      );

      bodyInfo.push([
        {
          text: index % 2 === 0 ? 'Estado' : 'QR',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: index % 2 === 0 ? '#FF6E00' : '#425066',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Nombre',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: index % 2 === 0 ? '#FF6E00' : '#425066',

          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Precio',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: index % 2 === 0 ? '#FF6E00' : '#425066',

          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Descuento',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: index % 2 === 0 ? '#FF6E00' : '#425066',

          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Stock',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: index % 2 === 0 ? '#FF6E00' : '#425066',

          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Categorias',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: index % 2 === 0 ? '#FF6E00' : '#425066',

          bold: true,
          border: [false, false, false, false],
        },

        // {
        //   text: 'Descripcion',
        //   style: 'tableHeader',
        //   colSpan: 1,
        //   alignment: 'center',
        //   color: '#FFFFFF',
        //   fillColor: '#FF6E00',
        //   bold: true,
        //   border: [false, false, false, false],
        // },

        {
          text: index % 2 === 0 ? 'QR' : 'Estado',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: index % 2 === 0 ? '#FF6E00' : '#425066',
          bold: true,
          border: [false, false, false, false],
        },
      ]);

      bodyInfo.push([
        index % 2 === 0
          ? {
              text: `${data.estado ? 'activo' : 'inactivo'}`,
              alignment: 'center',
              border: [false, false, false, true],
            }
          : {
              qr: data.uuid ? data.uuid : 'sin uuid',
              background: '#FFFFFF',
              fit: '70',
              border: [false, false, false, true],
            },
        {
          text: `${data.nombre}`,
          alignment: 'justify',
          border: [false, false, false, true],
        },
        {
          text: `${data.precio}Bs.`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${data.descuento}%`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${data.stock}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text:
            categories.length === 1
              ? categories[0]
              : categories
                  .slice(0, -1)
                  .join(', \n')
                  .concat(' y ' + categories.slice(-1)),
          alignment: 'center',
          border: [false, false, false, true],
        },

        // {
        //   text: `${data.descripcion}`,
        //   alignment: 'center',
        //   border: [false, false, false, true],
        // },

        index % 2 === 0
          ? {
              qr: data.uuid ? data.uuid : 'sin uuid',
              background: '#FFFFFF',
              fit: '70',
              border: [false, false, false, true],
            }
          : {
              text: `${data.estado ? 'activo' : 'inactivo'}`,
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

  private opinionesTable(
    pdf: Array<any>,
    opiniones: Array<OpinionProductoView>
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
        text: 'Fecha',
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
        text: 'Puntuacion',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Producto',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Verificado',
        style: 'tableHeader',
        colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#FF6E00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Titulo',
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

    opiniones.forEach((opinion) => {
      bodyInfo.push([
        {
          text: `${opinion.estado ? 'Activo' : 'Inactivo'}`,
          alignment: 'justify',
          border: [false, false, false, true],
        },
        {
          text: moment(opinion.creadoEn).format('DD/MM/YYYY[,] h:mm A'),
          alignment: 'justify',
          border: [false, false, false, true],
        },
        {
          text: opinion.cliente,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: opinion.puntuacion.toString(),
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${opinion.nombreProducto}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${opinion.verificado}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${opinion.titulo}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${opinion.descripcion}`,
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

  private ventasTable(pdf: Array<any>, ventas: Array<VentaView>): Array<any> {
    const bodyInfo: Array<BodyTable[]> = [];

    if (!ventas.length) {
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
          text: 'Fecha',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#FF6E00',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Nro. Venta',
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
          text: 'NIT/CI/CEX',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#FF6E00',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Depto.',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#FF6E00',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'TipoEnvio',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#FF6E00',
          bold: true,
          border: [false, false, false, false],
        },

        {
          text: 'MetodoPago',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#FF6E00',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Nombre Factura',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#FF6E00',
          bold: true,
          border: [false, false, false, false],
        },
      ]);
    }

    ventas.forEach((v) => {
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
          text: 'Fecha',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#FF6E00',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Nro. Venta',
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
          text: 'NIT/CI/CEX',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#FF6E00',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Depto.',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#FF6E00',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'TipoEnvio',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#FF6E00',
          bold: true,
          border: [false, false, false, false],
        },

        {
          text: 'MetodoPago',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#FF6E00',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Nombre Factura',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#FF6E00',
          bold: true,
          border: [false, false, false, false],
        },
      ]);
      bodyInfo.push([
        {
          text: `${v.estado}`,
          alignment: 'justify',
          color: v.estado === 'completado' ? '#2ac940' : '#ff6058',
          border: [false, false, false, true],
        },
        {
          text: moment(v.creadoEn).format('DD/MM/YYYY[,] h:mm A'),
          alignment: 'justify',
          border: [false, false, false, true],
        },
        {
          text: v.numeroVenta.toString(),
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: v.cliente,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: v.nitCiCex,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${v.departamento}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${v.tipoEnvio}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${v.metodoDePago}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${v.nombreFactura}`,
          alignment: 'center',
          border: [false, false, false, true],
        },
      ]);

      bodyInfo.push([
        {
          text: 'Producto',
          style: 'tableHeader',
          colSpan: 4,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#425066',
          bold: true,
          border: [false, false, false, false],
        },
        {},
        {},
        {},
        {
          text: 'Cantidad',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#425066',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Precio Unitario',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#425066',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Descuento',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#425066',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: 'Importe',
          style: 'tableHeader',
          colSpan: 2,
          alignment: 'center',
          color: '#FFFFFF',
          fillColor: '#425066',
          bold: true,
          border: [false, false, false, false],
        },
        {},
      ]);

      v.conceptos.forEach((c) => {
        bodyInfo.push([
          {
            text: `${c.nombre}`,
            alignment: 'justify',
            border: [false, false, false, true],
            colSpan: 4,
          },
          {},
          {},
          {},
          {
            text: c.cantidad.toString(),
            alignment: 'center',
            border: [false, false, false, true],
          },
          {
            text: `${c.precioUnitario.toString()} Bs.`,
            alignment: 'center',
            border: [false, false, false, true],
          },
          {
            text: `${c.descuento.toString()}%`,
            alignment: 'center',
            border: [false, false, false, true],
          },
          {
            text: `${c.importe.toString()} Bs.`,
            alignment: 'center',
            border: [false, false, false, true],
            colSpan: 2,
          },
          {},
        ]);
      });

      bodyInfo.push([
        { text: '', border: [false, false, false, true] },
        { text: '', border: [false, false, false, true] },
        { text: '', border: [false, false, false, true] },
        { text: '', border: [false, false, false, true] },
        { text: '', border: [false, false, false, true] },
        { text: '', border: [false, false, false, true] },
        { text: 'TOTAL: ', border: [false, false, false, true] },
        {
          text: `${v.total} Bs.`,
          alignment: 'center',
          border: [false, false, false, true],
          colSpan: 2,
        },
        {},
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

  public async reporte<T extends object>(
    pdf: Array<any>,
    data: Array<T>,
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
          text: moment(new Date()).format('DD/M/YYYY[,] h:mm A'),
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
          text: moment(new Date()).format('DD/MM/YYYY[,] h:mm A'),
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
      case 'producto':
        pdf = this.productoTable(pdf, data);
        break;
      case 'opiniones':
        pdf = this.opinionesTable(pdf, data);
        break;
      case 'ventas':
        pdf = this.ventasTable(pdf, data);
        break;
      default:
        break;
    }

    return pdf;
  }

  public async ventaCliente(
    pdf: Array<any>,
    venta: VentaView
  ): Promise<Array<any>> {
    const bodyInfo: Array<BodyTable[]> = [];
    const bodyDetalle: Array<BodyTable[]> = [];

    pdf.push({
      columns: [
        {
          image: await this.getBase64ImageFromURL(
            './assets/liraki_isotipo.svg'
          ),
          width: 50,
        },
        {
          text: 'LIRAKI',
          margin: [14, 8, 0, 0],
          fontSize: 24,
          color: '#425066',
        },
        {
          text: moment(venta.creadoEn).format('DD/MM/YYYY[,] h:mm A'),
          alignment: 'right',
          margin: [0, 14, 0, 0],
          fontSize: 14,
          color: '#425066',
        },
      ],
    });

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
        text: `${venta.nombreFactura}`,
        style: 'tableHeader',
        color: '#425066',
        colSpan: 1,
        border: [false],
        fontSize: 10,
        margin: [0, 2, 0, 0],
      },

      {
        qr: venta.uuid,
        background: '#FFFFFF',
        foreground: '#425066',
        fit: '90',
        rowSpan: 5,
        border: [false],
        alignment: 'center',
      },
    ]);

    bodyInfo.push([
      {
        text: 'NIT/CI/CEX:',
        style: 'tableHeader',
        colSpan: 1,
        color: '#000000',
        bold: true,
        border: [false],
      },
      {
        text: `${venta.nitCiCex}`,
        style: 'tableHeader',
        color: '#425066',
        colSpan: 1,
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
        text: `${venta.cliente}`,
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
        text: 'Departamento:',
        style: 'tableHeader',
        colSpan: 1,

        color: '#000000',
        bold: true,
        border: [false],
      },
      {
        text: `${venta.departamento}`.toUpperCase(),
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
        text: 'Dirección:',
        style: 'tableHeader',
        colSpan: 1,
        rowSpan: 2,

        color: '#000000',
        bold: true,
        border: [false],
      },
      {
        text: `${venta.direccion}`,
        style: 'tableHeader',
        colSpan: 1,
        rowSpan: 2,

        color: '#425066',
        border: [false],
        fontSize: 10,
        margin: [0, 2, 0, 0],
      },
      {},
    ]);

    bodyInfo.push([
      {},
      {},
      {
        text: `Nro. ${venta.numeroVenta}`,
        style: 'tableHeader',
        color: '#ff6058',
        colSpan: 1,
        border: [false],
        fontSize: 14,
        margin: [0, 2, 0, 0],
      },
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

    pdf.push({
      text: `${'DETALLE DE LA VENTA'}`.toUpperCase(),
      fontSize: 16,
      alignment: 'center',
      bold: true,
      margin: [0, 30, 0, 10],
      tocItem: true,
      tocMargin: [20, 0, 0, 0],
    });

    bodyDetalle.push([
      {
        text: 'Producto',
        style: 'tableHeader',
        // colSpan: 2,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#ff6e00',
        bold: true,
        border: [false, false, false, false],
      },

      {
        text: 'Cantidad',
        style: 'tableHeader',
        // colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#ff6e00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Precio Unitario',
        style: 'tableHeader',
        // colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#ff6e00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Descuento',
        style: 'tableHeader',
        // colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#ff6e00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Importe',
        style: 'tableHeader',
        // colSpan: 2,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#ff6e00',
        bold: true,
        border: [false, false, false, false],
      },
      // {},
    ]);

    venta.conceptos.forEach((c) => {
      bodyDetalle.push([
        {
          text: `${c.nombre}`,
          // alignment: 'justify',
          border: [false, false, false, true],
          // colSpan: 2,
        },

        // {},
        {
          text: c.cantidad.toString(),
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${c.precioUnitario.toString()} Bs.`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${c.descuento.toString()}%`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${c.importe.toString()} Bs.`,
          alignment: 'center',
          border: [false, false, false, true],
          // colSpan: 2,
        },
        // {},
      ]);
    });

    bodyDetalle.push([
      // { text: '', border: [false, false, false, true] },
      { text: '', border: [false, false, false, true] },
      { text: '', border: [false, false, false, true] },
      { text: '', border: [false, false, false, true] },
      { text: 'TOTAL: ', border: [false, false, false, true] },
      {
        text: `${venta.total} Bs.`,
        alignment: 'center',
        border: [false, false, false, true],
        // colSpan: 2,
      },
      // {},
    ]);

    pdf.push(
      this.centerObject({
        style: 'tableExample',
        table: {
          body: bodyDetalle,
          alignment: 'center',
          widths: ['*', 50, 100, 58, 100],
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

    pdf.push({
      text: '\t',
      margin: [0, 30, 0, 10],
    });

    pdf.push(
      this.centerObject({
        style: 'tableExample',
        table: {
          body: [
            [
              {
                border: [false, true, false, false],
                text: 'LIRAKI',
                alignment: 'center',
              },

              {
                border: [false, false, false, false],
                text: '',
              },
              {
                border: [false, true, false, false],
                text: 'CLIENTE',
                alignment: 'center',
              },
            ],
          ],
          alignment: 'center',
          widths: [80, 100, 80],
        },
      })
    );

    return pdf;
  }

  public async factura(pdf: Array<any>, venta: VentaView): Promise<Array<any>> {
    const bodyInfo: Array<BodyTable[]> = [];
    const bodyDetalle: Array<BodyTable[]> = [];
    const moreInfo: Array<BodyTable[]> = [];
    const footerInfo: Array<BodyTable[]> = [];

    pdf.push({
      columns: [
        {
          image: await this.getBase64ImageFromURL('./assets/liraki_logo.jpeg'),
          width: 150,
          style: 'tableHeader',
        },
        {},
        {},
        {},
      ],
    });

    bodyInfo.push([
      {
        text: 'CASA MATRIZ',
        style: 'tableHeader',
        colSpan: 2,
        color: '#000000',
        bold: true,
        alignment: 'center',
        border: [false, false, false, false],
        fontSize: 12,
      },
      {},
      {
        text: '',
        border: [false, false, false, false],
      },

      {
        text: 'NIT',
        style: 'tableHeader',
        colSpan: 1,
        color: '#000000',
        bold: true,
        border: [false, false, false, false],
        fontSize: 12,
      },
      {
        text: '34857631',
        style: 'tableHeader',
        colSpan: 1,
        color: '#425066',
        fontSize: 12,
        border: [false, false, false, false],
        alignment: 'right',
      },
    ]);

    bodyInfo.push([
      {
        text: `Av. Ingavi Nº 2450, Chimba, Cochabamba, Bolivia`,
        style: 'tableHeader',
        colSpan: 2,
        rowSpan: 2,
        color: '#000000',
        alignment: 'center',
        border: [false, false, false, false],
        fontSize: 12,
      },
      {},
      {
        text: '',
        border: [false, false, false, false],
      },

      {
        text: 'FACTURA N°',
        style: 'tableHeader',
        colSpan: 1,
        color: '#000000',
        bold: true,
        border: [false, false, false, false],
        fontSize: 12,
      },
      {
        text: `${venta.numeroVenta}`,
        style: 'tableHeader',
        colSpan: 1,
        color: '#ff0000',
        fontSize: 12,
        border: [false, false, false, false],
        alignment: 'right',
      },
    ]);

    bodyInfo.push([
      {},
      {},
      {
        text: '',
        border: [false, false, false, false],
      },
      {
        text: 'CÓD. AUTORIZACIÓN',
        style: 'tableHeader',
        colSpan: 2,
        color: '#000000',
        bold: true,
        border: [false, false, false, false],
        alignment: 'center',
        fontSize: 12,
      },
      {},
    ]);

    bodyInfo.push([
      {
        text: 'TELEFONOS:',
        style: 'tableHeader',
        colSpan: 1,
        color: '#000000',
        bold: true,
        alignment: 'center',
        border: [false, false, false, false],
        fontSize: 12,
      },
      {
        stack: [
          {
            color: '#425066',
            fontSize: 12,
            ul: ['4446257', '77413166', '77499792'],
          },
        ],
        border: [false, false, false, false],
      },
      {
        text: '',
        border: [false, false, false, false],
      },
      {
        text: `8ee6d45713154c9bbfae7d7e04ac75`.toUpperCase(),
        style: 'tableHeader',
        colSpan: 2,
        color: '#425066',
        fontSize: 10,
        border: [false, false, false, false],
        alignment: 'center',
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
        widths: [75, 75, '*', 'auto', 'auto'],
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

    pdf.push({
      text: `${'FACTURA'}`.toUpperCase(),
      fontSize: 16,
      alignment: 'center',
      bold: true,
      margin: [0, 30, 0, 0],
      tocItem: true,
      tocMargin: [20, 0, 0, 0],
    });

    pdf.push({
      text: '(Con Derecho a Crédito Fiscal)',
      fontSize: 12,
      alignment: 'center',
      margin: [0, 0, 0, 20],
      tocItem: true,
      tocMargin: [20, 0, 0, 0],
    });

    moreInfo.push([
      {
        text: 'Fecha:',
        border: [false, false, false, false],
        bold: true,
        fontSize: 12,
      },
      {
        text: moment(venta.creadoEn).format('DD/MM/YYYY[,] h:mm A'),
        fontSize: 12,
        border: [false, false, false, false],
      },
      {
        text: 'NIT/CI/CEX:',
        border: [false, false, false, false],
        bold: true,
        fontSize: 12,
      },
      {
        text: `${venta.nitCiCex}`,
        fontSize: 12,
        border: [false, false, false, false],
      },
    ]);

    moreInfo.push([
      {
        text: 'Nombre/Razon Social:',
        border: [false, false, false, false],
        bold: true,
        fontSize: 12,
      },
      {
        text: `${venta.nombreFactura}`,
        fontSize: 12,
        border: [false, false, false, false],
      },
      {
        text: '',
        border: [false, false, false, false],
        bold: true,
        fontSize: 12,
      },
      {
        text: '',
        fontSize: 12,
        border: [false, false, false, false],
      },
    ]);

    // *data
    pdf.push({
      style: 'tableExample',
      margin: [0, 10, 0, 0],
      table: {
        body: moreInfo,
        alignment: 'center',
        widths: ['auto', '*', 'auto', 'auto'],
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

    pdf.push({
      text: '\t',
      margin: [0, 0, 0, 0],
    });

    bodyDetalle.push([
      {
        text: 'Producto',
        style: 'tableHeader',
        // colSpan: 2,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#ff6e00',
        bold: true,
        border: [false, false, false, false],
      },

      {
        text: 'Cantidad',
        style: 'tableHeader',
        // colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#ff6e00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Precio Unitario',
        style: 'tableHeader',
        // colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#ff6e00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Descuento',
        style: 'tableHeader',
        // colSpan: 1,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#ff6e00',
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: 'Importe',
        style: 'tableHeader',
        // colSpan: 2,
        alignment: 'center',
        color: '#FFFFFF',
        fillColor: '#ff6e00',
        bold: true,
        border: [false, false, false, false],
      },
      // {},
    ]);

    venta.conceptos.forEach((c) => {
      bodyDetalle.push([
        {
          text: `${c.nombre}`,
          // alignment: 'justify',
          border: [false, false, false, true],
          // colSpan: 2,
        },

        // {},
        {
          text: c.cantidad.toString(),
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${c.precioUnitario.toString()} Bs.`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${c.descuento.toString()}%`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${c.importe.toString()} Bs.`,
          alignment: 'center',
          border: [false, false, false, true],
          // colSpan: 2,
        },
        // {},
      ]);
    });

    bodyDetalle.push([
      // { text: '', border: [false, false, false, true] },
      { text: '', border: [false, false, false, true] },
      { text: '', border: [false, false, false, true] },
      { text: '', border: [false, false, false, true] },
      { text: 'TOTAL: ', border: [false, false, false, true] },
      {
        text: `${venta.total} Bs.`,
        alignment: 'center',
        border: [false, false, false, true],
        // colSpan: 2,
      },
      // {},
    ]);

    pdf.push(
      this.centerObject({
        style: 'tableExample',
        table: {
          body: bodyDetalle,
          alignment: 'center',
          widths: ['*', 50, 100, 58, 100],
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

    pdf.push({
      text: '\t',
      margin: [0, 10, 0, 0],
    });

    footerInfo.push([
      {
        text: 'ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS, EL USO ILÍCITO SERÁ SANCIONADO PENALMENTE DE ACUERDO A LEY',
        alignment: 'center',
        bold: true,
        border: [false, false, false, false],
      },
      {
        qr: venta.uuid,
        background: '#FFFFFF',
        foreground: '#425066',
        fit: '90',
        rowSpan: 3,
        border: [false],
        alignment: 'center',
      },
    ]);

    footerInfo.push([
      {
        text: 'Ley Nro. 453: El proveedor debe brindar atención sin discriminar, con respeto, calidez y cordialidad a los usuarios y consumidores.',
        alignment: 'justify',
        border: [false, false, false, false],
      },
      {},
    ]);
    footerInfo.push([
      {
        text: '“Este documento es la Representación Gráfica de un Documento Fiscal Digital emitido en una modalidad de facturación en línea”',
        alignment: 'justify',
        border: [false, false, false, false],
      },
      {},
    ]);

    // *data
    pdf.push({
      style: 'tableExample',
      margin: [0, 10, 0, 0],
      table: {
        body: footerInfo,
        alignment: 'center',
        widths: ['*', 'auto'],
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
          text: `${capitulo.total} Bs.`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${capitulo.descuento}%`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${capitulo.totalDescuento} Bs.`,
          alignment: 'center',
          border: [false, false, false, true],
        },
        {
          text: `${capitulo.total != 0 ? capitulo.total : 0} Bs.`,
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
        }Bs.`,
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
        }Bs.`,
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
        }Bs.`,
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
            text: `${capitulo.total} Bs.`,
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
                text: `${detalle.precioUnitario}Bs.`,
                alignment: 'center',
                border: [false, false, false, true],
              },
              {
                text: `${detalle.precioUnitario * detalle.cantidad}Bs.`,
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

  delay = (s) => {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  };

  public observacionObra(
    pdf: Array<any>,
    observaciones: Array<ObservacionObraView>,
    visita: VisitaProyecto
  ): Promise<Array<any>> {
    return new Promise(async (resolve) => {
      const bodyInfo: Array<BodyTable[]> = [];

      if (visita) {
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
              text: moment(visita.fecha).format('MM/DD/YYYY').toUpperCase(),
              alignment: 'right',
              margin: [0, 14, 0, 0],
              fontSize: 14,
              color: '#425066',
            },
          ],
        });

        bodyInfo.push([
          {
            text: 'Visita:',
            style: 'tableHeader',
            colSpan: 1,
            color: '#000000',
            bold: true,
            border: [false],
          },
          {
            text: `${visita.nombre.toUpperCase()}`,
            style: 'tableHeader',
            color: '#425066',
            colSpan: 1,
            border: [false],
            fontSize: 10,
            margin: [0, 2, 0, 0],
          },

          {
            qr: `${visita.uuidProyecto}`,
            background: '#FFFFFF',
            foreground: '#425066',
            fit: '65',
            rowSpan: 3,
            border: [false],
          },
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
            text: `${visita.descripcion}`,
            style: 'tableHeader',
            colSpan: 1,
            color: '#425066',
            fontSize: 10,
            border: [false],
            margin: [0, 2, 0, 0],
          },
          {},
        ]);

        bodyInfo.push([
          {
            text: 'Fase del Proyecto:',
            style: 'tableHeader',
            colSpan: 1,
            color: '#000000',
            bold: true,
            border: [false, false, false, false],
          },
          {
            stack: [
              {
                color: '#425066',
                fontSize: 10,
                ul: visita.faseDelProyecto
                  ? visita.faseDelProyecto.split(' <=> ')
                  : [],
              },
            ],

            border: [false, false, false, false],
          },
          {},
        ]);

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

        pdf.push([{ text: '\n' }]);
      }

      for (const obs of observaciones) {
        const bodyTable: Array<BodyTable[]> = [];
        bodyTable.push([
          {
            text: 'Punto de Inspeccion',
            style: 'tableHeader',
            colSpan: 1,
            alignment: 'center',
            color: '#FFFFFF',
            fillColor: '#FF6E00',
            bold: true,
            border: [false, false, false, false],
          },
          {
            text: 'Observacion',
            style: 'tableHeader',
            colSpan: 1,
            alignment: 'center',
            color: '#FFFFFF',
            fillColor: '#FF6E00',
            bold: true,
            border: [false, false, false, false],
          },
          {
            text: 'Levantamiento de Observacion',
            style: 'tableHeader',
            colSpan: 1,
            alignment: 'center',
            color: '#FFFFFF',
            fillColor: '#FF6E00',
            bold: true,
            border: [false, false, false, false],
          },
        ]);
        bodyTable.push([
          {
            text: `${obs?.puntoDeInspeccion}`,
            alignment: 'justify',
            border: [false, false, false, true],
          },
          {
            text: `${obs?.observacion}`,
            alignment: 'justify',
            border: [false, false, false, true],
          },
          {
            text: `${obs?.levantamientoObservacion}`,
            alignment: 'center',
            border: [false, false, false, true],
          },
        ]);
        bodyTable.push([
          {
            text: '\n',
            border: [false, false, false, false],
            colSpan: 3,
          },
          {},
          {},
        ]);

        pdf.push(
          this.centerObject({
            style: 'tableExample',
            table: {
              body: bodyTable,
              alignment: 'center',
              widths: [155, 155, 155],
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

        pdf.push({
          text: 'FOTOS DE LA OBSERVACION',
          bold: true,
          style: 'header',
          alignment: 'center',
          decoration: 'underline',
          decorationStyle: 'solid',
        });

        for (const f of obs.fotos) {
          pdf.push([{ text: '\n' }]);
          pdf.push({
            image: await this.getBase64ImageFromURL(this.getImage(f.keyName)),
            width: 300,
            alignment: 'center',
          });
        }
      }

      resolve(pdf);
    });
  }

  // !TRBAJANDO AQUI ================================================
  public planificacion(
    pdf: Array<any>,
    planificacion: PlanificacionProyectoView,
    proyecto: Proyecto
  ): Promise<Array<any>> {
    return new Promise(async (resolve) => {
      const bodyInfo: Array<BodyTable[]> = [];

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
            text: moment(planificacion.creadoEn)
              .format('MM/DD/YYYY')
              .toUpperCase(),
            alignment: 'right',
            margin: [0, 14, 0, 0],
            fontSize: 14,
            color: '#425066',
          },
        ],
      });

      bodyInfo.push([
        {
          text: 'Planificacion:',
          style: 'tableHeader',
          colSpan: 1,
          color: '#000000',
          bold: true,
          border: [false],
        },
        {
          text: `${planificacion.titulo.toUpperCase()}`,
          style: 'tableHeader',
          color: '#425066',
          colSpan: 1,
          border: [false],
          fontSize: 10,
          margin: [0, 2, 0, 0],
        },

        {
          qr: `${planificacion.uuidProyecto}`,
          background: '#FFFFFF',
          foreground: '#425066',
          fit: '65',
          rowSpan: 3,
          border: [false],
        },
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
          text: `${planificacion.subtitulo}`,
          style: 'tableHeader',
          colSpan: 1,
          color: '#425066',
          fontSize: 10,
          border: [false],
          margin: [0, 2, 0, 0],
        },
        {},
      ]);

      bodyInfo.push([
        {
          text: '',
          style: 'tableHeader',
          colSpan: 1,
          color: '#000000',
          bold: true,
          border: [false, false, false, false],
        },
        {
          text: '',
          style: 'tableHeader',
          colSpan: 1,
          color: '#000000',
          bold: true,
          border: [false, false, false, false],

          // stack: [
          //   {
          //     color: '#425066',
          //     fontSize: 10,
          //     ul: planificacion.
          //   },
          // ],
          // border: [false, false, false, false],
        },
        {},
      ]);

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

      pdf.push([{ text: '\n' }]);

      // *Header

      planificacion.capitulos.forEach(
        (capitulo: CapituloPlanificacionProyecto, detalleIndex: number) => {
          const bodyTable: Array<BodyTable[]> = [];
          bodyTable.push([
            {
              text: 'Capitulo',
              style: 'tableHeader',
              colSpan: 1,
              alignment: 'center',
              color: '#FFFFFF',
              fillColor: '#FF6E00',
              bold: true,
              border: [true, true, false, false],
            },

            {
              text: 'Avance',
              style: 'tableHeader',
              colSpan: 1,
              alignment: 'center',
              color: '#FFFFFF',
              fillColor: '#FF6E00',
              bold: true,
              border: [false, true, false, false],
            },

            {
              text: 'Fecha Inicio',
              style: 'tableHeader',
              colSpan: 1,
              alignment: 'center',
              color: '#FFFFFF',
              fillColor: '#FF6E00',
              bold: true,
              border: [false, true, false, false],
            },
            {
              text: 'Fecha Final',
              style: 'tableHeader',
              colSpan: 1,
              alignment: 'center',
              color: '#FFFFFF',
              fillColor: '#FF6E00',
              bold: true,
              border: [false, true, true, false],
            },
          ]);

          bodyTable.push([
            {
              text: `${capitulo.nombre}`,
              alignment: 'center',
              border: [true, false, false, true],
              colSpan: 1,
            },

            {
              text: `${capitulo.avance}%`,
              alignment: 'center',
              border: [false, false, false, true],
            },

            {
              text: `${moment(capitulo.fechaInicio).format(
                'DD [de] MMMM YYYY'
              )}`,
              alignment: 'center',
              border: [false, false, false, true],
            },
            {
              text: `${moment(capitulo.fechaFinal).format(
                'DD [de] MMMM YYYY'
              )}`,
              alignment: 'center',
              border: [false, false, true, true],
            },
          ]);

          pdf.push(
            // this.centerObject({
            {
              style: 'tableExample',
              table: {
                body: bodyTable,
                alignment: 'center',
                widths: ['*', 'auto', 130, 130],
              },
              layout: {
                hLineWidth: function (i, node) {
                  return i === 0 || i === node.table.body.length ? 1 : 1;
                },
                vLineWidth: function (i, node) {
                  return i === 0 || i === node.table.widths.length ? 1 : 0;
                },
                hLineColor: function (i, node) {
                  return '#425066';
                },
                vLineColor: function (i, node) {
                  return '#425066';
                },
              },
            }
            // })
          );

          let tareas = planificacion.tareas.filter(
            (t) => t.uuidCapitulo === capitulo.uuid
          );

          const bodyTareas: Array<BodyTable[]> = [];

          if (tareas.length) {
            bodyTareas.push([
              {
                text: 'Tarea',
                style: 'tableHeader',
                colSpan: 1,
                alignment: 'center',
                color: '#FFFFFF',
                fillColor: '#425066',
                bold: true,
                border: [true, true, false, false],
              },
              {
                text: 'Actividades y Recursos',
                style: 'tableHeader',
                colSpan: 1,
                alignment: 'center',
                color: '#FFFFFF',
                fillColor: '#425066',
                bold: true,
                border: [true, true, false, false],
              },
              {
                text: 'Avance',
                style: 'tableHeader',
                colSpan: 1,
                alignment: 'center',
                color: '#FFFFFF',
                fillColor: '#425066',
                bold: true,
                border: [true, true, false, false],
              },

              {
                text: 'Fecha Inicio',
                style: 'tableHeader',
                colSpan: 1,
                alignment: 'center',
                color: '#FFFFFF',
                fillColor: '#425066',
                bold: true,
                border: [true, true, false, false],
              },
              {
                text: 'Fecha Final',
                style: 'tableHeader',
                colSpan: 1,
                alignment: 'center',
                color: '#FFFFFF',
                fillColor: '#425066',
                bold: true,
                border: [false, true, true, false],
              },
            ]);

            tareas.forEach((tarea) => {
              let div = document.createElement('div');
              div.innerHTML = tarea.actividades;
              let textActividades: string[] = [];
              let actividades = div.getElementsByTagName('li');

              for (let i = 0; i < actividades.length; i++) {
                textActividades.push('• ' + actividades.item(i).textContent);
              }

              bodyTareas.push([
                {
                  text: `${tarea.nombre}`,
                  alignment: 'center',
                  border: [true, false, false, true],
                },
                {
                  text: `${
                    textActividades.length
                      ? textActividades.join('\n')
                      : '⚫ Ninguno'
                  }`,

                  // text: tarea.actividades.replace(/<\/?[^>]+>/gi, ''),
                  // alignment: 'justify',
                  border: [false, false, false, true],
                  colSpan: 1,
                },
                {
                  text: `${tarea.avance}%`,
                  alignment: 'justify',
                  border: [false, false, false, true],
                },

                {
                  text: `${moment(tarea.fechaInicio).format(
                    'DD [de] MMMM YYYY'
                  )}`,
                  alignment: 'center',
                  border: [false, false, false, true],
                },
                {
                  text: `${moment(tarea.fechaFinal).format(
                    'DD [de] MMMM YYYY'
                  )}`,
                  alignment: 'center',
                  border: [false, false, true, true],
                },
              ]);
            });
          }

          bodyTareas.push([
            {
              text: '\n',
              border: [false, false, false, false],

              colSpan: 5,
            },
            {},
            {},
            {},
            {},
          ]);

          pdf.push(
            // this.centerObject(
            {
              style: 'tableExample',
              table: {
                body: bodyTareas,
                alignment: 'center',
                widths: ['*', '*', 'auto', 'auto', 'auto'],
              },
              layout: {
                hLineWidth: function (i, node) {
                  return i === 0 || i === node.table.body.length ? 1 : 1;
                },
                vLineWidth: function (i, node) {
                  return i === 0 || i === node.table.widths.length ? 1 : 0;
                },
                hLineColor: function (i, node) {
                  return '#425066';
                },
                vLineColor: function (i, node) {
                  return '#425066';
                },
              },
            }
            // )
          );
        }
      );

      resolve(pdf);
    });
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
function li(li: any) {
  throw new Error('Function not implemented.');
}
