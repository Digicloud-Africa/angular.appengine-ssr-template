import { Component } from '@angular/core';
import {FirestoreInitService} from "./firestore-init.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tour of Users';
  constructor(private firestore: FirestoreInitService){
  }

  ngOnInit() {
    this.firestore.createDb();
  }
}
