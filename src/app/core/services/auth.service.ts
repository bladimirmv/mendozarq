import { RoleValidator } from './../helpers/roleValidator';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of, empty } from 'rxjs';
import { Injectable } from '@angular/core';

import { Usuario, Roles } from '@app/shared/models/usuario.interface';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator {

  public userData$: Observable<firebase.User>;
  private usuarioCollection: AngularFirestoreCollection<Usuario>;
  public user$: Observable<Usuario>;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    super();
    this.userData$ = afAuth.authState;
    this.usuarioCollection = afs.collection<Usuario>('usuarios');
    this.user$ = afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.collection<Usuario>('usuarios', ref => ref.where('uid', '==', user.uid))
            .snapshotChanges()
            .pipe(
              map(actions =>
                actions.map(a => {
                  const data = a.payload.doc.data() as Usuario;
                  const docid = a.payload.doc.id;
                  return { docid, ...data };
                })
              )
            );
        } else {
          return of(null);
        }
      })
    );
  }
  // ====================================================================
  public addUsuario(data: Usuario): Promise<DocumentReference> {
    data.creadoEn = new Date();
    return this.usuarioCollection.add(data);
  }

  public updateUsuario(data: Usuario): Promise<void> {
    return this.usuarioCollection.doc(data.docid).update(data);
  }
  // ====================================================================
  public getAllUsuarios(): Observable<Usuario[]> {
    return this.afs.collection<Usuario>('usuarios', ref => ref.orderBy('creadoEn'))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Usuario;
            const docid = a.payload.doc.id;
            return { docid, ...data };
          })
        )
      );
  }
  // ====================================================================
  public getAllUsuariosByTipo(tipoUsuario: Roles): Observable<Usuario[]> {
    return this.afs.collection<Usuario>('usuarios', ref => ref.orderBy('creadoEn').where('rol', '==', tipoUsuario))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {

            const data = a.payload.doc.data() as Usuario;
            const docid = a.payload.doc.id;
            return { docid, ...data };
          })
        )
      );
  }
  // ====================================================================
  public getOneUsuario(docid: string): Observable<Usuario> {
    return this.afs.doc<Usuario>(`usuarios/${docid}`).valueChanges();
  }
  // ====================================================================
  public deleteUsuario(docid: string): Promise<void> {
    return this.usuarioCollection.doc(docid).delete();
  }
  // ====================================================================

  public registerUsuario(usr: Usuario): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(usr.correo, usr.contrasenha)
      .then((res) => {
        const { correo, docid } = usr;
        this.updateUsuario({ docid, correo, activo: true, uid: res.user.uid });
      });
  }
  // ====================================================================
  public loginByEmailAndPassword(correo, contrasenha): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(correo, contrasenha);

  }

}
