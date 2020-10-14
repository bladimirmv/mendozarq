let bd: {
  usuario: [
    {
      docid?: string;
      creadoEn?: Date;
      uid?: string;
      displayName?: string;
      photoURL?: string;
      nombre: string;
      apellidos: string;
      celular?: number;
      direccion?: string;
      correo?: string;
      contrasenha?: string;
      rol: string;
    }
  ],
  mendozarq: {
    personal: [
      {
        idPersonal?: string;
        creadoEn?: Date;
        idUsuario: string;
        cargo?: string;
        sueldo?: number;
        filerefCont?: string;
        urlCont?: string;
      }
    ],
    proyecto: [
      {
        idProyecto?: string;
        creadoEn?: Date;
        nombre: string;
        descripcion?: string;
        categoria?: string[];
        estado: boolean;
        fechaInicio?: Date;
        fechaFinal?: Date;
        lugarProyecto?: string;
        filerefCont?: string;
        urlCont?: string;
        idCliente?: string;
        porcentaje?: number;
      }
    ],

    categoriaProyecto: [
      {
        idCatProyecto?: string;
        creadoEn?: Date;
        nombre?: string;
      }
    ],
    cronograma: [
      {
        idCronograma?: string;
        creadoEn?: Date;
        idProyecto: string;
        fechaInicio?: Date;
        fechaFinal?: Date;
      }
    ],
    actividad: [
      {
        idActividad?: string;
        creadoEn?: Date;
        creadoPor?: string;
        idCronograma: string;
        nombre?: Date;
        fechaInicio?: Date;
        fechaFinal?: Date;
        porcentaje?: number;
        recurso?: string[];
      }
    ],
    participanteProyecto: [
      {
        idParticipante?: string;
        creadoEn?: Date;
        idProyecto: string;
        idPersonal?: string;
      }
    ],
    documentoProyecto: [
      {
        idDocumento?: string;
        creadoEn?: Date;
        idProyecto: string;
        nombre: string;
        urlDoc: string;
        filerefDoc: string;
        tipo: string;
      }
    ],
    servicioProyecto: [
      {
        idServicio?: string;
        creadoEn?: Date;
        nombre: string;
        descripcion: string;
        avance: number;
        fechaInicio: Date;
        fechaFinal: string;
      }
    ],
    visitaProyecto: [
      {
        idVisita?: string;
        creadoEn?: Date;
        nombre: string;
        descripcion?: string;
        numeroVisita: number;
        fecha?: Date;
        participantes?: string[];
        servicios?: string[];
      }
    ],
    observacionParticipante: [
      {
        idObsrParticipante?: string;
        creadoEn?: Date;
        estado: string;
        idParticipante?: string;
        descripcion?: string;
      }
    ],
    observacionServicio: [
      {
        idServicio?: string;
        creadoEn?: Date;
        estado: string;
        descripcion?: string;
      }
    ],
    asistenciaVisita: [
      {
        creadoEn?: Date;
        idParticipante?: string;
        idVisitaProyecto: string;
        estado: string;
      }
    ],

    presupuestoDeObra: [
      {
        idPresupuesto?: string;
        creadoEn?: Date;
        nombre: string;
        descripcion?: string;
        idProyecto?: string;
        idCliente?: string;
        totalPresupuesto: number;
      }
    ],
    detallePresupuesto: [
      {
        idDetallePresupuesto?: string;
        creadoEn?: Date;
        nombre: string;
        idPresupuesto?: string;
        totalDetalle?: number;
        subDetalle?: [
          {
            nombre: string;
            medida: string;
            cantidad: number;
            precioUnitario: number;
            totalSubDetalle?: number;
          }
        ]
      }
    ],
    recurso: [{
      idRecurso: string;
      creadoEn?: Date;
      nombre?: Date;
      categoria?: Date;
      filerefImg?: Date;
      urlImg?: number;
      estado?: boolean;
    }],
    categoriaRecurso: [
      {
        creadoEn?: Date;
        idCategoria?: string;
        nombre?: string;
      }
    ],
    importacion: [
      {
        idImportacion?: string;
        creadoEn?: Date;
        nombre: string;
        descripcion: string;
      }
    ]

  },
  liraki: {
    producto: [
      {
        idProducto?: string;
        creadoEn?: Date;
        nombre: string;
        descripcion: string;
        imagen?: string;
        fileref?: string;
        categorias: string[];
        precio?: number;
        moneda?: string;
        stock: number;
        disponible?: boolean;
      }
    ],
    categoriaProducto: [
      {
        idProducto?: string;
        creadoEn?: Date;
        nombre: string;
        description: string;
        urlImg?: any;
        filerefImg?: string;
      }
    ],
    reservaProducto: [
      {
        idReservaProducto?: string;
        creadoEn?: Date;
        idUsuario: string;
        estado: boolean;
        detalleReserva: [
          {
            idProducto: string;
            cantidad: number;
          }
        ]
      }
    ],
    ventaProducto: [
      {
        idVentaProducto?: string;
        creadoEn?: Date;
        idUsuario: string;
        totalVenta?: number;
        detalleVenta: [
          {
            idProducto: string;
            cantidad: number;
            totalDetalle: number;
          }
        ]
      }
    ],
    comentarioProducto: [
      {
        idComentario?: string;
        creadoEn?: Date;
        idUsuario: string;
        comentario: string;
      }
    ]
  }
};


