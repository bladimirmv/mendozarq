import { NewPresupuestoProyectoComponent } from './components/new-presupuesto-proyecto/new-presupuesto-proyecto.component';
import { MatDialog } from '@angular/material/dialog';
import { PresupuestoObra } from '@models/mendozarq/presupuestos.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-presupuestos-proyecto',
  templateUrl: './presupuestos-proyecto.component.html',
  styleUrls: ['./presupuestos-proyecto.component.scss'],
})
export class PresupuestosProyectoComponent implements OnInit {
  public presupuestoObra: PresupuestoObra | null = {} as PresupuestoObra;

  public uuidProyecto: string;
  public showChart: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private matDialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.presupuestoObra = this._route.snapshot.data['presupuesto'];
    this.uuidProyecto = this._route.snapshot.parent.parent.params.uuid;

    console.log('presupuesto: ', this.presupuestoObra);
  }

  public newPresupuestoProyecto() {
    const dialogRef = this.matDialog.open(NewPresupuestoProyectoComponent, {
      data: this.uuidProyecto,
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      const PATH_URL = this.router.url;
      if (res) {
        this.router.navigateByUrl('blank').then(() => {
          this.router.navigateByUrl(PATH_URL);
        });
      }
    });
  }
}
