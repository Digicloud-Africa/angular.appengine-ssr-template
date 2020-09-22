import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

import { Hero } from './hero';
import { MessageService } from './message.service';



@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl : string = "heroes";
  constructor(private firestore: AngularFirestore,
    private messageService: MessageService) {
  }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    let collection = this.firestore.collection<Hero>("heroes");
    const heroes$ = collection
      .valueChanges();
    return heroes$;
  }

  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: string): Observable<Hero> {
    return this.firestore.doc<Hero>("heroes/" +id).valueChanges()
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: string): Observable<Hero> {
    return this.firestore.doc<Hero>("heroes/" +id).valueChanges().pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.firestore.collection<Hero>(this.heroesUrl,
        ref => {return ref.where("name", "==", "")})
      .valueChanges().pipe(
      tap(x => x.length ?
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    this.firestore.collection<Hero>(this.heroesUrl)
      .add(hero)
      .then(heroRef =>{
        this.log(`added hero w/ id=${heroRef.id}`)
        return this.getHero(heroRef.id);
    }).catch(err => {
      catchError(this.handleError<Hero>('addHero'))
    });
    return null;
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    this.firestore.doc<Hero>("heroes/" +id).delete().then(() =>{
      this.log(`deleted hero w/ id=${id}`)
    }).catch(err => {
      catchError(this.handleError<Hero>('addHero'))
    });
    return null;
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    this.firestore.doc<Hero>("heroes/" +hero.id).update(hero).then(() =>{
      this.log(`update hero w/ id=${hero.id}`);
      return this.getHero(hero.id);
    }).catch(err => {
      catchError(this.handleError<Hero>('addHero'))
    });
    return null;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
