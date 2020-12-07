
import { Injectable } from '@angular/core';

import { CategoriaProyectoService } from './categoria-proyecto.service';
import { Proyecto } from '@app/shared/models/mendozarq/proyecto.interface';


@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  constructor() {
  }

  // ==================================================================================
  public addProyecto(proyecto: Proyecto): any {

  }
  // ==================================================================================
  public updateProyecto(proyecto: Proyecto): any {
  }
  // ==================================================================================
  public deleteProyecto(personal: Proyecto): any {
  }
  // ==================================================================================
  public getOneProyecto(idProyecto: string): any {
  }
  // ==================================================================================
  public getAllProyectos(): any {

  }
  // ==================================================================================

}
