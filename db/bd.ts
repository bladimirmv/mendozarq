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
        filerefCont?: string;
        urlCont?: string;
        personal: string[];
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
        recurso?: string;
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
    ]

  }
};


