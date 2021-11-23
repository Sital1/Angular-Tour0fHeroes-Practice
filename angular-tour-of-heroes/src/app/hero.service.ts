
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './heroes/hero';
import { MessageService } from './message.service';
import { HEROES } from './mock-heroes';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {


  private heroesUrl = 'api/heroes';  // URL to web api

  constructor(private messageService:MessageService, private http:HttpClient) { }

  getHeroes(): Observable<Hero[]>{
    // const heroes = of(HEROES);
    // this.messageService.add("Heroes fetched successfully");
    // return heroes;

    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes',[]))
    );

  }


  getHero(id:number):Observable<Hero>{

    const url = `${this.heroesUrl}/${id}`

    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );

  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  updateHero(hero: Hero):Observable<any> {

    return this.http.put(this.heroesUrl,hero,this.httpOptions).
    pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
    
  }


  /** POST: add a new hero to the server */
addHero(hero: Hero): Observable<Hero> {
  return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
    tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
    catchError(this.handleError<Hero>('addHero'))
  );
}

/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable<Hero[]> {
  if (!term.trim()) {
    // if not search term, return empty hero array.
    return of([]);
  }
  return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
    tap(x => x.length ?
       this.log(`found heroes matching "${term}"`) :
       this.log(`no heroes matching "${term}"`)),
    catchError(this.handleError<Hero[]>('searchHeroes', []))
  );
}



  handleError<T>(operation='operation', result?:T)
{
    return(error:any):Observable<T> => {

      console.log(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);

    }
}

private log(message:string){
  this.messageService.add(`HeroService: ${message}`)
}




}
