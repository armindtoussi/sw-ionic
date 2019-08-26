// Ng 
import { Injectable } from "@angular/core";
// Services
import { SwapiService } from '../services/swapi.service';
// Rxjs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Models
import { Film } from '../models/films.model';
// Env
import { environment } from 'src/environments/environment';

/* 
    Movies Service implementation acts as a layer 
    between movie component and SWapi wrapper.
*/
@Injectable()
export class MoviesService { 


    constructor(private _swService: SwapiService) { }


    getMovies(): Observable<Film[]> {
        return this._swService.get(environment.swapiMovies)
            .pipe(
                map(res => res['results'].sort(
                    (a: Film, b:Film) => a.episode_id - b.episode_id)),
            );
    }

    search(searchText: string, type: string): Observable<any> {
        let url = `${environment.swapiBase}${type}/${environment.swapiSearch}${searchText}`;
        return this._swService.genericFetch(url)
            .pipe(
                map(res => res['results'].sort(
                    (a: Film, b: Film) => a.episode_id - b.episode_id)
                ),
            );
    }
}