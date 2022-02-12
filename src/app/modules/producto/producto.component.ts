import { PdfService } from '@services/pdf/pdf.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { ProductoService } from '@services/liraki/producto.service';
import {
  FotoProducto,
  Producto,
  ProductoView,
} from '@models/liraki/producto.interface';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { map, takeUntil } from 'rxjs/operators';
import { NewProductoComponent } from './components/new-producto/new-producto.component';
import { EditProductoComponent } from './components/edit-producto/edit-producto.component';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { CategoriaProducto } from '@app/shared/models/liraki/categoria.producto.interface';
import { environment } from '@env/environment';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ImgPreviewComponent } from '@app/shared/components/img-preview/img-preview.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ProductoComponent implements OnInit, OnDestroy {
  private API_URL = environment.API_URL;

  private destroy$: Subject<any> = new Subject<any>();
  public activos: number = 0;
  public inactivos: number = 0;
  public productos: Array<Producto> = [];
  selected: Producto[] = [];
  selection = new SelectionModel<Producto>(true, []);
  filterValue: string;
  public columns: Array<string> = [
    'seleccion',
    'estado',
    'nombre',
    'precio',
    'stock',
    'categorias',
    'descripcion',
    'barcode',
    'edit',
  ];
  expandedElement: ProductoView | null;
  public source: MatTableDataSource<Producto> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pdfResult: any;

  constructor(
    private productoSvc: ProductoService,
    private dialog: MatDialog,
    private toastrSvc: ToastrService,
    private pdfSvc: PdfService
  ) {}

  ngOnInit(): void {
    this.getAllProducto();

    this.source.paginator = this.paginator;
    this.source.sort = this.sort;

    this.selection.changed
      .pipe(map((a) => a.source))
      .subscribe((data) => (this.selected = data.selected));
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private async generatePdf(uuid: string): Promise<void> {
    const docDefinition = {
      pageSize: {
        width: 68,
        height: 68,
      },
      pageMargins: [5, 5, 5, 5],
      content: [
        {
          qr: uuid ? uuid : 'sin uuid',
          background: '#FFFFFF',
          fit: '70',
        },
      ],
    };

    this.pdfResult = this.pdfSvc.createPdf(docDefinition);
    this.pdfSvc.open(this.pdfResult);

    // this.pdfSvc.dowload(this.pdfSvc.createPdf(docDefinition), `qr_(${uuid})`);

    // console.log(await this.pdfSvc.getPdfDataUrl(this.pdfResult));

    // const a = document.createElement('a');
    // a.href = await this.pdfSvc.getPdfDataUrl(this.pdfResult);
    // a.download = '';
    // a.click();
  }

  dowloadBarcode(producto: Producto): void {
    // var a = document.createElement('a'); //Create <a>
    // a.href = this.textToBase64Barcode(producto.uuid); //Image Base64 Goes here
    // a.download = producto.nombre + '.png';
    // a.click(); //Downloaded file

    this.generatePdf(producto.uuid);
  }

  private getAllProducto(): void {
    this.productoSvc
      .getAllProductos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productos: Producto[]) => {
        this.source.data = productos;
        this.productos = productos;
        productos.filter((prod) => {
          this.activos += prod.estado ? 1 : 0;
          this.inactivos += prod.estado ? 0 : 1;
        });
      });
  }

  public addProducto(): void {
    const dialogRef = this.dialog.open(NewProductoComponent);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        // if (res === true) {
        this.getAllProducto();
        // }
      });
  }

  public editProducto(producto: Producto): void {
    const dialogRef = this.dialog.open(EditProductoComponent, {
      data: producto,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        this.getAllProducto();
      });
  }

  public deleteProducto(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOneProducto()
            : this.deleteMoreThanOneProducto();
        }
      });
  }

  private deleteOneProducto(): void {
    this.productoSvc
      .deleteProducto(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.toastrSvc.success(
            'Se ha eliminado correctamente',
            'Producto Eliminado',
            {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
            }
          );
          this.getAllProducto();
          this.clearCheckbox();
        }
      });
  }

  private deleteMoreThanOneProducto(): void {
    this.selected.forEach((servicio, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.productoSvc
        .deleteProducto(servicio.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res && isLast) {
            this.toastrSvc.success(
              'Se han eliminado correctamente',
              'Productos Eliminados',
              {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              }
            );
            this.getAllProducto();
            this.clearCheckbox();
          }
        });
    });
  }

  // =====================> downloadFile
  public downloadFile(foto: FotoProducto): void {
    const link = document.createElement('a');
    link.setAttribute('href', `${this.API_URL}/api/file/${foto.keyName}`);
    link.setAttribute('download', foto.keyName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  public modalPreview(fotos: FotoProducto[], foto: FotoProducto): void {
    const keyNames: Array<string> = fotos.map(
      (foto: FotoProducto) => `${this.API_URL}/api/file/${foto.keyName}`
    );
    this.dialog.open(ImgPreviewComponent, {
      data: {
        fotos: keyNames,
        current: keyNames.indexOf(`${this.API_URL}/api/file/${foto.keyName}`),
      },
      panelClass: 'custom-dialog-container',
    });
  }

  public commaText(text: CategoriaProducto[]): string {
    let result: string = '';
    text.forEach((categroria: CategoriaProducto, index: number) => {
      result += categroria.nombre;
      result += index === text.length - 1 ? '.' : ', ';
    });
    return result;
  }

  public getImage(keyName: string): string {
    return `${this.API_URL}/api/file/${keyName}`;
  }

  // !important, this part is for producto table.
  // =====================> applyFilter
  applyFilter(event: Event | string): void {
    typeof event === 'string'
      ? (this.filterValue = event)
      : (this.filterValue = (event.target as HTMLInputElement).value);

    this.source.filter = this.filterValue.trim().toLowerCase();
    if (this.source.paginator) {
      this.source.paginator.firstPage();
    }
  }
  // =====================> isAllSelected
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.source.data.length;
    return numSelected === numRows;
  }
  // =====================> masterToggle
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.source.data.forEach((row) => this.selection.select(row));
  }
  // =====================> clearCheckbox
  clearCheckbox(): void {
    this.selection.clear();
  }
  // =====================> checkboxLabel
  checkboxLabel(row?: Producto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.uuid
    }`;
  }
}
