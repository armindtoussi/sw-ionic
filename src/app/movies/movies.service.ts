// Ng
import { Injectable } from '@angular/core';
// Services
import { SwapiService } from '../services/swapi.service';
// Rxjs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Models
import { Film, FilmsModel } from '../models/films.model';
// Env
import { environment } from 'src/environments/environment';

/*
    Movies Service implementation acts as a layer
    between movie component and SWapi wrapper.
*/
@Injectable()
export class MoviesService {

    /** Ctor injects SW api service */
    constructor(private swService: SwapiService) { }

    /**
     * Gets movies list from api, sorts asc.
     *
     * Pre Rxjs 5.5 way:
     *
     * import { map } from 'rxjs/add/operator/map';
     *
     * return this.swService.get(environment.swapiMovies)
     *          .map(res: FilmsModel) => res.results.sort((a, b) => a.episode_id - b.episode_id));
     */
    getMovies(): Observable<Film[]> {
        return this.swService.get(environment.swapiMovies)
            .pipe(
                map((res: FilmsModel) => res.results.sort(
                    (a: Film, b: Film) => a.episode_id - b.episode_id)),
            );
    }

    /**
     * Searches api for given text, sorts asc.
     *
     * @param searchText text to search for
     */
    search(searchText: string): Observable<Film[]> {
        const url = `${environment.swapiBase}${environment.swapiMovies}${environment.swapiSearch}${searchText}`;
        return this.swService.genericFetch(url)
            .pipe(
                map((res: FilmsModel) => res.results.sort(
                    (a: Film, b: Film) => a.episode_id - b.episode_id)
                ),
            );
    }
}
