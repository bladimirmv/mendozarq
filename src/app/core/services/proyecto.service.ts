import { CategoriaProyectoService } from './categoria-proyecto.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Personal } from './../../shared/models/mendozarq/personal.interface';
import { AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Proyecto } from '@app/shared/models/mendozarq/proyecto.interface';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private proyectoCollection: AngularFirestoreCollection<Proyecto>;
  constructor(private afs: AngularFirestore, private catProyectoSvc: CategoriaProyectoService) {
    this.proyectoCollection = this.afs.collection<Proyecto>('proyecto');
  }

  // ==================================================================================
  public addProyecto(proyecto: Proyecto): Promise<DocumentReference> {
    proyecto.creadoEn = new Date();
    return this.proyectoCollection.add(proyecto);
  }
  // ==================================================================================
  public updateProyecto(proyecto: Proyecto): Promise<void> {
    return this.proyectoCollection.doc(proyecto.idProyecto).update(proyecto);
  }
  // ==================================================================================
  public deleteProyecto(personal: Personal): Promise<void> {
    return this.proyectoCollection.doc(personal.idPersonal).delete();
  }
  // ==================================================================================
  public getOneProyecto(idProyecto: string): Observable<Proyecto> {
    return this.afs.doc<Proyecto>(`proyecto/${idProyecto}`).valueChanges();
  }
  // ==================================================================================
  public getAllProyectos(): Observable<Proyecto[]> {
    return this.afs.collection<Proyecto>('proyecto', ref => ref.orderBy('creadoEn'))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const idProyecto = a.payload.doc.id;
            const data = a.payload.doc.data() as Proyecto;
            const dateOptions = {
              weekday: 'long',
              year: 'numeric',
              month: '2-digit',
              day: 'numeric'
            };
            data.fechaInicio = data.fechaInicio.toDate().toLocaleString('es', dateOptions);
            data.fechaFinal = data.fechaFinal.toDate().toLocaleString('es', dateOptions);
            return { idProyecto, ...data };
          })
        )
      );
  }
  // ==================================================================================
}
