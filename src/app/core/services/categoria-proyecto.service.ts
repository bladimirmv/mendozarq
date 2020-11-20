import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CategoriaProyecto } from './../../shared/models/mendozarq/categoria.proyecto.interface';
import { Injectable } from '@angular/core';

import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';

import { CategoriaProyecto } from '@models/mendozarq/categoria.proyecto.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProyectoService {
  private categoriaProyectoCollection: AngularFirestoreCollection<CategoriaProyecto>;
  constructor(private afs: AngularFirestore) {
    this.categoriaProyectoCollection = this.afs.collection<CategoriaProyecto>('categoriaProyecto');
  }

  // ====================================================================
  public addCategoriaProyecto(catProyecto: CategoriaProyecto): Promise<DocumentReference> {
    return this.categoriaProyectoCollection.add(catProyecto);
  }
  // ====================================================================
  public updateCategoriaProyecto(catProyecto: CategoriaProyecto): Promise<void> {
    return this.categoriaProyectoCollection.doc(catProyecto.idCatProyecto).update(catProyecto);
  }

  // ====================================================================
  public deleteCategoriaProyecto(catProyecto: CategoriaProyecto): Promise<void> {
    return this.categoriaProyectoCollection.doc(catProyecto.idCatProyecto).delete();
  }
  // ====================================================================
  public getOneCategoriaProyecto(idCatProyecto: string): Observable<CategoriaProyecto> {
    return this.afs.doc<CategoriaProyecto>(`categoriaProyecto/${idCatProyecto}`).valueChanges();
  }
  // ====================================================================

  public getAllCategoriaProyecto(): Observable<CategoriaProyecto[]> {
    return this.afs.collection<CategoriaProyecto>('categoriaProyecto', ref => ref.orderBy('creadoEn'))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as CategoriaProyecto;
            const idCatProyecto = a.payload.doc.id;
            return { idCatProyecto, ...data };
          }))
      )

  }
  // ====================================================================

}
