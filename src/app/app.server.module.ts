import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import {FirestoreInitService} from "./firestore-init.service";
import {AngularFirestore} from "../providers/angular.firestore";

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  providers: [
    // Add server-only providers here.
    FirestoreInitService,
    AngularFirestore
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
