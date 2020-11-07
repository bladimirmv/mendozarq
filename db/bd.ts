let bd: {
  usuario: [
    {
      docid?: string;
      creadoEn?: Date;
      uid?: string;
      displayName?: string;
      photoURL?: string;
      nombre: string;
      apellidoPaterno: string;
      apellidoMaterno: string;
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
        idCliente?: string;
        nombre: string;
        descripcion?: string;
        categoria?: string[];
        estado: boolean;
        fechaInicio?: Date;
        fechaFinal?: Date;
        lugarProyecto?: string;
        filerefCont?: string;
        urlCont?: string;
        porcentaje?: number;
      }
    ],

    categoriaProyecto: [
      {
        idCatProyecto?: string;
        creadoEn?: Date;
        idProyecto: string;
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
        idProyecto: string;
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
        idVisita: string;
        estado: string;
        idParticipante?: string;
        descripcion?: string;
      }
    ],
    observacionServicio: [
      {
        idObsrServicio?: string;
        creadoEn?: Date;
        idVisita: string;
        estado: string;
        idServicio?: string;
        descripcion?: string;
      }
    ],
    asistenciaVisita: [
      {
        idAsistencia?: string;
        creadoEn?: Date;
        idParticipante?: string;
        idVisita: string;
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
      nombre?: string;
      categoria?: string;
      filerefImg?: string;
      urlImg?: number;
      estado?: boolean;
    }],
    categoriaRecurso: [
      {
        idCategoria?: string;
        creadoEn?: Date;
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
        urlImg?: string;
        filerefImg?: string;
        categorias: string[];
        precio?: number;
        moneda?: string;
        stock: number;
        estado?: boolean;
      }
    ],
    categoriaProducto: [
      {
        idCategoria?: string;
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
        idReserva?: string;
        creadoEn?: Date;
        idUsuario: string;
        estado: string;
        detalleReserva: [
          {
            producto: string;
            cantidad: number;
          }
        ]
      }
    ],
    ventaProducto: [
      {
        idVenta?: string;
        creadoEn?: Date;  
        idUsuario: string;
        totalVenta?: number;
        detalleVenta: [
          {
            producto: any[];
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
        idProducto: string;
        comentario: string;
      }
    ],
    carritoProducto: [
      { 
        idCarrito?: string;
        idUsuario: string;
        detalleCarrito: [
          {
            producto: any[];
            cantidad: number;
            totalDetalle: number;
          }
        ]
      }
    ]
  }
};


