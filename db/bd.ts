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
        nombre: string;
        descripcion?: string;
        creadoEn?: Date;
      }
    ],
    detalleProyecto: [
      {
        idProyecto: string;
        idCliente?: string;
        fechaInicio?: Date;
        fechaFinal?: Date;
        encargados: string[];
        filerefdoc?: string;
        urldoc?: string;
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
        imagen?: any;
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


