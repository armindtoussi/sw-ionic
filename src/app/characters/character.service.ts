// Ng
import { Injectable } from '@angular/core';
// Service
import { SwapiService } from '../services/swapi.service';
// Model
import { Character, CharacterModel } from '../models/character.model';
// Rxjs
import { Observable, pipe,
         UnaryFunction } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
// Env
import { environment } from 'src/environments/environment';


/**
 * Character Service implementation acts as a layer
 * between character component and SWapi wrapper.
 */
@Injectable()
export class CharacterService {
    /** Holds the url for the next page of results. */
    private nextUrl: string;
    /** Holds the total count of results for a given query. */
    private count: number;
    /** Holds the results of queries. */
    private characters: Character[];

    /**
     * ctor, injects dependencies.
     * @param swService sw api wrapper.
     */
    constructor(private swService: SwapiService) { }

    /**
     * Gets characters via swapi service.
     * @returns a sorted array of Character objects.
     */
    getCharacters(): Observable<Character[]> {
        return this.swService.get(environment.swapiPeople)
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
    loadMore(): Observable<Character[]> {
        return this.swService.genericFetch(this.nextUrl)
            .pipe(
                this.mapNextAndReturn(),
            );
    }

    /**
     * Searches the swapi people for the given text.
     * @param searchText the text to search for.
     */
    search(searchText: string): Observable<Character[]> {
        const url = `${environment.swapiBase}${environment.swapiPeople}${environment.swapiSearch}${searchText}`;
        return this.swService.genericFetch(url)
            .pipe(
                this.mapAndFetch(),
                this.mapSetAndReturn(),
            );
    }

    /**
     * Fetches a single character by id.
     * @param id the charater id to fetch.
     */
    fetchCharacter(id: string): Observable<Character> {
        const url = `${environment.swapiBase}${environment.swapiPeople}${environment.swapiSearch}${id}`;
        return this.swService.genericFetch(url)
            .pipe(
                map((res: CharacterModel) => res.results[0]),
            );
    }

    /**
     * Fetches array of data of a particular type.
     * @param arr array of urls to fetch.
     */
    fetchArrayData(arr: string[]): Observable<object[]> {
        return this.swService.arrayFetch(arr);
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
    private mapAndFetch(): UnaryFunction<Observable<CharacterModel>, Observable<object>> {
        return pipe(
            map((res: CharacterModel) => {
                this.nextUrl = res.next;
                this.characters = res.results;
            }),
            map(() => this.swService.genericFetch(this.nextUrl)),
            flatMap(res => res)
        );
    }

    /**
     * Custom operator, maps the url, count, and characters,
     * sorts and returns the character stream.
     */
    private mapSetAndReturn(): UnaryFunction<Observable<CharacterModel>, Observable<Character[]>> {
        return pipe(
            map((res: CharacterModel) => {
                if (res === null || res === undefined) {
                    return this.characters;
                }
                this.nextUrl = res.next;
                this.count = res.count;
                this.characters = this.characters.concat(res.results)
                                      .sort((a: Character,
                                             b: Character) =>
                                             this.sortArr(a.name, b.name));
                return this.characters;
              }),
        );
    }

    /**
     * Custom operator, maps the url and characters,
     * sorts and returns the character stream out of the pipe.
     */
    private mapNextAndReturn(): UnaryFunction<Observable<CharacterModel>, Observable<Character[]>> {
        return pipe(
            map((res: CharacterModel) => {
                this.nextUrl = res.next;
                this.characters = this.characters.concat(res.results)
                                      .sort((a: Character,
                                             b: Character) =>
                                             this.sortArr(a.name, b.name));
                return this.characters;
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
