let Interfaces: {
  usuario: [
    {
      creadoEn?: Date;
      docid?: string;
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
        creadoEn?: Date;
        idPersonal?: string;
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
      }
    ],

    categoriaProyecto: [
      {
        creadoEn?: Date;
        idCategoria?: string;
        nombre?: string;
      }
    ],
    cronograma: [
      {
        creadoEn?: Date;
        idCronograma?: string;
        idProyecto: string;
        fechaInicio?: Date;
        fechaFinal?: Date;
      }
    ],
    actividad: [
      {
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
    visitaProyecto: [
      {
        creadoEn?: Date;
        nombre: string;
        numeroVisita: number;
        fecha?: Date;
        descripcion?: string;
        participantes?: string[];
        servicios?: string[];
      }
    ],
    observacionParticipante: [
      {
        creadoEn?: Date;
        estado: string;
        idParticipante?: string;
        descripcion?: string;
      }
    ],
    observacionServicio: [
      {
        creadoEn?: Date;
        estado: string;
        idServicio?: string;
        descripcion?: string;
      }
    ],
    asistenciaVisita: [
      {
        creadoEn?: Date;
        estado: string;
      }
    ],
    participanteProyecto: [
      {
        creadoEn?: Date;
        idProyecto: string;
        idEmpleado?: string;
      }
    ],
    documentoProyecto: [
      {
        creadoEn?: Date;
        nombre: string;
        urlDoc: string;
        filerefDoc: string;
        pesoDoc: string;
      }
    ],
    servicioProyecto: [
      {
        creadoEn?: Date;
        nombre: string;
        avance: number;
        fechaInicio: Date;
        fechaFinal: string;
        descripcion: string;
      }
    ],

    presupuestoDeObra: [
      {
        creadoEn?: Date;
      }
    ],
    recurso: [{
      creadoEn?: Date;
      idRecurso: string;
      nombre?: Date;
      categoria?: Date;
      filerefImg?: Date;
      urlImg?: number;
      condicion?: string;
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
        creadoEn?: Date;
      }
    ]
    material: [
      {
        creadoEn?: Date;
      }
    ]

  },
  liraki: {
    producto: [
      {
        idProducto?: string;
        nombre: string;
        descripcion: string;
        imagen?: string;
        fileref?: string;
        categorias: string[];
        precio?: number;
        moneda?: string;
        stock: number;
        disponible?: boolean;
        creadoEn?: Date;
      }
    ],
    categoriaProducto: [
      {
        idProducto?: string;
        nombre: string;
        description: string;
        image?: any;
        fileref?: string;
        creadoEn?: Date;
      }
    ],
    reservaProducto: [
      {
        creadoEn?: Date;
      }
    ],
    ventaProducto: [
      {
        creadoEn?: Date;
      }
    ],
    comentarioProducto: [
      {
        creadoEn?: Date;
      }
    ]
  }
};


