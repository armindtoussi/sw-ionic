// Ng
import { Injectable } from '@angular/core';
// Models
import { Starship, StarshipsModel } from '../models/starships.model';
// Services
import { SwapiService } from '../services/swapi.service';
// Rxjs
import { Observable, pipe, UnaryFunction } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
// Env
import { environment } from 'src/environments/environment';


/**
 * Starships service implementation acts as a layer
 * between starships component and swapiwrapper.
 */
@Injectable()
export class StarshipsService {
    /** Holds the url for the next page of results. */
    private nextUrl: string;
    /** Holds the total count of results for a given query. */
    private count: number;
    /** Holds the results of queries. */
    private ships: Starship[];

    /**
     * ctor, injects dependencies.
     * @param swService sw api wrapper.
     */
    constructor(private swService: SwapiService) { }

    /**
     * Gets starships via swapi service.
     * @returns a sorted array of Starship objects.
     */
    getStarships(): Observable<Starship[]> {
        return this.swService.get(environment.swapiShips)
            .pipe(
                this.mapAndFetch(),
                this.mapSetAndReturn(),
            );
    }

    /**
     * Loads more results either from search or basic
     * starship load functionality.
     * @returns a sorted array of Starship objects.
     */
    loadMore(): Observable<Starship[]> {
        return this.swService.genericFetch(this.nextUrl)
            .pipe(
                this.mapNextAndReturn(),
            );
    }

    /**
     * Searches the swapi starships for the given text.
     * @param searchText the text to search for.
     */
    search(searchText: string): Observable<Starship[]> {
        const url = `${environment.swapiBase}${environment.swapiShips}${environment.swapiSearch}${searchText}`;
        return this.swService.genericFetch(url)
            .pipe(
                this.mapAndFetch(),
                this.mapSetAndReturn(),
            );
    }

    /**
     * exposes the nextUrl field for reading.
     */
    hasNext(): string | null {
        return this.nextUrl;
    }

    /**
     * exposes the count field for reading.
     */
    getCount(): number {
        return this.count;
    }

    /**
     * Custom operator, maps url and characters,
     * fetches next set of characters to add to obs stream,
     * flattens 2 streams into one.
     *
     * This is an example of a custom operator. Not a completely
     * custom operator built from scratch, but rather a custom operator
     * that pipes together a chain of normal operators used in a specific
     * way that is specific to this program and that can be used repeatedly
     * where needed.
     *
     * It takes in an observable stream and returns out an observable stream.
     */
    private mapAndFetch(): UnaryFunction<Observable<StarshipsModel>, Observable<object>> {
        return pipe(
            map((res: StarshipsModel) => {
                this.nextUrl = res.next;
                this.ships = res.results;
            }),
            map(() => this.swService.genericFetch(this.nextUrl)),
            flatMap(res => res)
        );
    }

    /**
     * Custom operator, maps the url, count, and characters,
     * sorts and returns the character stream.
     */
    private mapSetAndReturn(): UnaryFunction<Observable<StarshipsModel>, Observable<Starship[]>> {
        return pipe(
            map((res: StarshipsModel) => {
                if (res === null || res === undefined) {
                    return this.ships;
                }
                this.nextUrl = res.next;
                this.count = res.count;
                this.ships = this.ships.concat(res.results)
                                       .sort((a: Starship,
                                              b: Starship) =>
                                              this.sortArr(a.name, b.name));
                return this.ships;
              }),
        );
    }

    /**
     * Custom operator, maps the url and characters,
     * sorts and returns the character stream out of the pipe.
     */
    private mapNextAndReturn(): UnaryFunction<Observable<StarshipsModel>, Observable<Starship[]>> {
        return pipe(
            map((res: StarshipsModel) => {
                this.nextUrl = res.next;
                this.ships = this.ships.concat(res.results)
                                       .sort((a: Starship,
                                              b: Starship) =>
                                              this.sortArr(a.name, b.name));
                return this.ships;
            })
        );
    }

    /**
     * string compare function.
     * @param a string to sort.
     * @param b string to sort.
     */
    public sortArr(a: string, b: string): number {
        return (a).localeCompare(b);
    }
}
