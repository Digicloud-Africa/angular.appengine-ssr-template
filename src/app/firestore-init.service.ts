import { Injectable } from '@angular/core';
import { User } from '../model/user';
import {AngularFirestore} from "../providers/angular.firestore";

@Injectable({
  providedIn: 'root',
})
export class FirestoreInitService extends AngularFirestore {

  createDb() {
    const users = [
      { id: 11, name: 'Dr Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
      { id: 15, name: 'Magneta' },
      { id: 16, name: 'RubberMan' },
      { id: 17, name: 'Dynama' },
      { id: 18, name: 'Dr IQ' },
      { id: 19, name: 'Magma' },
      { id: 20, name: 'Tornado' }
    ];
    this.firestore.listCollections().then(allCollections=>{
      if (!allCollections.filter(coll => coll.id === 'users').length){
        users.forEach(user => {
          this.userCollection.doc(user.id+"").set(user);
        })
      }
    })
    return {users};
  }

  // Overrides the genId method to ensure that a user always has an id.
  // If the users array is empty,
  // the method below returns the initial number (11).
  // if the users array is not empty, the method below returns the highest
  // user id + 1.
  // static genId(users: User[]): number {
  //   return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 11;
  // }
}
