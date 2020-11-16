import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Personal } from './../../shared/models/mendozarq/personal.interface';
import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private personalCollection: AngularFirestoreCollection<Personal>;

  constructor(private afs: AngularFirestore) {
    this.personalCollection = this.afs.collection<Personal>('personal');
  }
  // ====================================================================
  public addPersonal(personal: Personal): Promise<DocumentReference> {
    personal.creadoEn = new Date();
    return this.personalCollection.add(personal);
  }
  // ====================================================================
  public updatePersonal(personal: Personal): Promise<void> {
    return this.personalCollection.doc(personal.idPersonal).update(personal);
  }
  // ====================================================================
  public deletePersonal(personal: Personal): any {
    return this.personalCollection.doc(personal.idPersonal).delete();
  }
  // ====================================================================
  public getOnePersonal(idPersonal: string): Observable<Personal> {
    return this.afs.doc<Personal>(`personal/${idPersonal}`).valueChanges();
  }
  // ====================================================================
  public getAllPersonal(): Observable<Personal[]> {
    return this.afs.collection<Personal>('personal', ref => ref.orderBy('creadoEn'))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Personal;
            const idPersonal = a.payload.doc.id;
            return { idPersonal, ...data };
          })
        )
      );
  }
  // ====================================================================

}
