import {Injectable} from '@angular/core';
import {Firestore} from '@google-cloud/firestore';
import { environment } from '../environments/environment';
import CollectionReference = FirebaseFirestore.CollectionReference;
import DocumentReference = FirebaseFirestore.DocumentReference;
import DocumentData = FirebaseFirestore.DocumentData;
import * as firestore from '../environments/firestore.json';

@Injectable()
export class AngularFirestore {

  protected firestore: Firestore;
  public userCollection: CollectionReference ;

  constructor() {
    this.firestore = new Firestore({
      projectId: firestore.project_id,
      credentials: {client_email: firestore.client_email, private_key: firestore.private_key}
    });
    this.userCollection = this.firestore.collection('users');
    console.log('firestore initialised');
  }

  async collection<T>(name: string): Promise<T[]>{
    return await this.firestore.collection(name).get().then( (allItems) => {
      return allItems.docs.map<T>(doc => Object.assign(doc.data()));
    });
  }

  collectionRef(name: string): CollectionReference<DocumentData> {
    return this.firestore.collection(name);
  }

  async doc<T>(id: string): Promise<T>{
    return await this.firestore.doc(id).get().then(doc => Object.assign(doc.data()));
  }

  docRef(id: string): DocumentReference<DocumentData>{
    return this.firestore.doc(id);
  }
}

// const fs = new AngularFirestore();
// fs.collectionRef('dars').get().then(all => {
//     console.log(all.docs.length);
// });
