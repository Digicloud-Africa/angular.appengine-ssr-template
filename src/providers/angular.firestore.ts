import {Injectable} from '@angular/core';
import {Firestore} from '@google-cloud/firestore';
import { environment } from '../environments/environment';
import {from, Observable} from 'rxjs';
import CollectionReference = FirebaseFirestore.CollectionReference;
import DocumentReference = FirebaseFirestore.DocumentReference;
import DocumentData = FirebaseFirestore.DocumentData;

@Injectable()
export class AngularFirestore {

    private firestore: Firestore;
    public darRef: CollectionReference ;
    public tiersRef: CollectionReference;
    public partnerTypesRef: CollectionReference;
    public specialisationRef: CollectionReference;
    constructor() {
        if (!environment.production) {
            this.firestore = new Firestore({
                projectId: 'dar-portal-dev',
                keyFilename: './src/environments/dar-portal-dev.json'
            });
        } else  {
            this.firestore = new Firestore({
                projectId: 'dar-portal',
                keyFilename: './src/environments/dar-portal-951e5ec06cf6.json'
            });
        }

        this.darRef = this.firestore.collection('dars');
        this.tiersRef = this.firestore.collection('Tiers');
        this.partnerTypesRef = this.firestore.collection('PartnerTypes');
        this.specialisationRef = this.firestore.collection('Specialisations');
    }

    collection<T>(name: string): Observable<T[]>{
        return from(this.firestore.collection(name).get().then(allDars => {
           return allDars.docs.map<T>(doc => Object.assign(doc.data()));
        }));
    }

    collectionRef(name: string): CollectionReference<DocumentData> {
        return this.firestore.collection(name);
    }

    doc<T>(id: string): Observable<T>{
        return from(this.firestore.doc(id).get().then(doc => Object.assign(doc.data())));
    }

    docRef(id: string): DocumentReference<DocumentData>{
        return this.firestore.doc(id);
    }
}

const fs = new AngularFirestore();
fs.collectionRef('dars').get().then(all => {
    console.log(all.docs.length);
});
