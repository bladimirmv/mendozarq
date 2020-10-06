let db: {
  usuario: [
    {
      uid?: string;
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
        idProyecto: string;
        creadoEn?: Date;
        nombre: string;
        descripcion?: string;
        categoria?: string;
        tiempo?: Date;
        estado: boolean;
        fechaInicio?: Date;
        fechaFinal?: Date;
        filerefdoc?: string;
        urldoc?: string;
        personal: string[];
        idCliente?: string;
      }
    ],
    personal: [
      {
        idUsuario: string;
        cargo?: string;
        sueldo?: number;
        contrato?: string;
      }
    ],
    cronograma: [
      {
        idProyecto: string;
        fechaInicio?: Date;
        fechaFinal?: Date;
        detalle?: string;
      }
    ],
    actividades: [
      {
        idCronograma: string;
        actividad?: Date;
        fechaInicio?: Date;
        fechaFinal?: Date;
      }
    ],
    herramienta: [{
      nombre: string;
      descripcion: string;
      estado: number;
    }]
  },
  liraki: {
    producto: [
      {
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
    categoria: [
      {
        nombre: string;
        description: string;
        image?: any;
        fileref?: string;
        creadoEn?: Date;
      }
    ]

  }
};


