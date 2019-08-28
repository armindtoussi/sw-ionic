// Ng
import { Injectable } from '@angular/core';
// Services
import { SwapiService } from '../services/swapi.service';
// Models
import { Planet, PlanetsModel } from '../models/planets.model';
// Rxjs
import { Observable, UnaryFunction, pipe } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
// Env
import { environment } from 'src/environments/environment';


/**
 * Planet Service implementation acts as a layer
 * between planet component and swapi wrapper.
 */
@Injectable()
export class PlanetsService {
    /** Holds the url for the next page of results. */
    private nextUrl: string;
    /** Holds the total count of results for a given query. */
    private count: number;
    /** Holds the results of queries. */
    private planets: Planet[];

    /**
     * ctor, injects dependencies.
     * @param swService sw api wrapper.
     */
    constructor(private swService: SwapiService) { }

    getPlanets(): Observable<Planet[]> {
        return this.swService.get(environment.swapiPlanets).pipe(
            this.mapAndFetch(),
            this.mapSetAndReturn(),
        );
    }

    /**
     * Loads more results either from search or basic
     * character load functionality.
     * @returns a sorted array of Character objects.
     */
    loadMore(): Observable<Planet[]> {
        return this.swService.genericFetch(this.nextUrl)
            .pipe(
                this.mapNextAndReturn(),
            );
    }

    /**
     * Searches the swapi planets for the given text.
     * @param searchText the text to search for.
     */
    search(searchText: string): Observable<Planet[]> {
        const url = `${environment.swapiBase}${environment.swapiPlanets}${environment.swapiSearch}${searchText}`;
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
     * It takes in an observable stream and returns out an observable stream.
     */
    private mapAndFetch(): UnaryFunction<Observable<PlanetsModel>, Observable<object>> {
        return pipe(
            map((res: PlanetsModel) => {
               this.nextUrl = res.next;
               this.planets = res.results;
            }),
            map(() => this.swService.genericFetch(this.nextUrl)),
            flatMap(res => res)
        );
    }

    /**
     * Custom operator, maps the url, count, and characters,
     * sorts and returns the character stream.
     */
    private mapSetAndReturn(): UnaryFunction<Observable<PlanetsModel>, Observable<Planet[]>> {
        return pipe(
            map((res: PlanetsModel) => {
                if (res === null || res === undefined) {
                    return this.planets;
                }
                this.nextUrl = res.next;
                this.count = res.count;
                this.planets = this.planets.concat(res.results)
                                   .sort((a: Planet,
                                          b: Planet) =>
                                          this.sortArr(a.name, b.name));
                return this.planets;
            }),
        );
    }

    /**
     * Custom operator, maps the url and characters,
     * sorts and returns the character stream out of the pipe.
     */
    private mapNextAndReturn(): UnaryFunction<Observable<PlanetsModel>, Observable<Planet[]>> {
        return pipe(
            map((res: PlanetsModel) => {
                this.nextUrl = res.next;
                this.planets = this.planets.concat(res.results)
                                   .sort((a: Planet,
                                          b: Planet) =>
                                          this.sortArr(a.name, b.name));
                return this.planets;
            }),
        );
    }

    /**
     * String sort function.
     * @param a string to sort
     * @param b string to sort
     */
    public sortArr(a: string, b: string): number {
        return (a).localeCompare(b);
    }
}
