// Ng
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// ENV config.
import { environment } from 'src/environments/environment';
// RXJS
import { Observable, forkJoin, of } from 'rxjs';

/**
 * SWapi Wrapper service.
 */
@Injectable({
    providedIn: 'root'
})
export class SwapiService {


    constructor(private http: HttpClient) { }


    get(type: string): Observable<object> {
        return this.http.get(environment.swapiBase + type);
    }

    getPlanets(): Observable<object> {
        return this.http.get(environment.swapiBase +
                              environment.swapiPlanets);
    }

    getSpecies(): Observable<object> {
        return this.http.get(environment.swapiBase +
                              environment.swapiSpecies);
    }

    getStarships(): Observable<object> {
        return this.http.get(environment.swapiBase +
                              environment.swapiShips);
    }

    getVehicles(): Observable<object> {
        return this.http.get(environment.swapiBase +
                              environment.swapiVehicles);
    }

    genericFetch(url: string): Observable<object> {
        if (url === null) { // To handle url null case on a next.
            return of(null);
        }
        return this.http.get(url);
    }

    arrayFetch(urls: string[]): Observable<any> {
        const arr = [];
        for (const i of urls) {
            arr.push(this.http.get(i));
        }

        return forkJoin(arr);
    }

    /**
     * Searches api with given text and given type.
     * @param searchText text to search for.
     * @param type the search type.
     */
    search(searchText: string, type: string): Observable<any> {
        const url = `${environment.swapiBase}${type}${environment.swapiSearch}${searchText}`;
        return this.http.get(url);
    }
}