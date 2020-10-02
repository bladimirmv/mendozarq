import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { Usuario } from '@app/shared/models/usuario.interface';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { firestore } from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioCollection: AngularFirestoreCollection<Usuario>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.usuarioCollection = afs.collection<Usuario>('usuarios');
  }

  public addUsuario(data: Usuario): Promise<DocumentReference> {
    data.creadoEn = new Date();
    return this.usuarioCollection.add(data);
  }

  public getAllUsuarios(): Observable<Usuario[]> {
    return this.afs.collection<Usuario>('usuarios', ref => ref.orderBy('creadoEn'))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Usuario;
            const docid = a.payload.doc.id;
            return { docid, ...data }
          })
        )
      );
  }
}
