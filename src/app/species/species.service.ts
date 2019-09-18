// Ng
import { Injectable } from '@angular/core';
// Services
import { SwapiService } from '../services/swapi.service';
// Model
import { Species, SpeciesModel } from '../models/species.model';
// Rxjs
import { Observable, UnaryFunction, pipe } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
// Env
import { environment } from 'src/environments/environment';

/**
 * Species Service implementation acts as a layer
 * between species component and SWapi wrapper.
 */
@Injectable()
export class SpeciesService {
    /** Holds the url for the next page of results. */
    private nextUrl: string;
    /** Holds the total count of results for a given query. */
    private count: number;
    /** Holds the results of queries. */
    private species: Species[];

    /**
     * ctor, injects dependencies.
     * @param swService sw api wrapper.
     */
    constructor(private swService: SwapiService) { }

    /**
     * Gets Species via swapi service.
     * @returns a sorted array of Species objects.
     */
    getSpecies(): Observable<Species[]> {
        return this.swService.get(environment.swapiSpecies)
            .pipe(
                this.mapAndFetch(),
                this.mapSetAndReturn(),
            );
    }

    /**
     * Loads more results either from search or basic
     * character load functionality.
     * @returns a sorted array of Character objects.
     */
    loadMore(): Observable<Species[]> {
        return this.swService.genericFetch(this.nextUrl)
            .pipe(
                this.mapNextAndReturn(),
            );
    }

    /**
     * Searches the swapi people for the given text.
     * @param searchText the text to search for.
     */
    search(searchText: string): Observable<Species[]> {
        const url = `${environment.swapiBase}${environment.swapiSpecies}${environment.swapiSearch}${searchText}`;
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
    private mapAndFetch(): UnaryFunction<Observable<SpeciesModel>, Observable<object>> {
        return pipe(
            map((res: SpeciesModel) => {
                this.nextUrl = res.next;
                this.species = res.results;
            }),
            map(() => this.swService.genericFetch(this.nextUrl)),
            flatMap(res => res)
        );
    }

    /**
     * Custom operator, maps the url, count, and characters,
     * sorts and returns the character stream.
     */
    private mapSetAndReturn(): UnaryFunction<Observable<SpeciesModel>, Observable<Species[]>> {
        return pipe(
            map((res: SpeciesModel) => {
                if (res === null || res === undefined) {
                    return this.species;
                }
                this.nextUrl = res.next;
                this.count = res.count;
                this.species = this.species.concat(res.results)
                                   .sort((a: Species,
                                          b: Species) =>
                                          this.sortArr(a.name, b.name));
                return this.species;
              }),
        );
    }

    /**
     * Custom operator, maps the url and characters,
     * sorts and returns the character stream out of the pipe.
     */
    private mapNextAndReturn(): UnaryFunction<Observable<SpeciesModel>, Observable<Species[]>> {
        return pipe(
            map((res: SpeciesModel) => {
                this.nextUrl = res.next;
                this.species = this.species.concat(res.results)
                                   .sort((a: Species,
                                          b: Species) =>
                                          this.sortArr(a.name, b.name));
                return this.species;
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
