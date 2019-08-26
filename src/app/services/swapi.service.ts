import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//ENV config.
import { environment } from 'src/environments/environment';
//RXJS
import { Observable, forkJoin } from 'rxjs';

/**
 * SWapi Wrapper service.
 */
@Injectable({
    providedIn: 'root'
})
export class SwapiService {


    constructor(private _http: HttpClient) { }


    get(type: string): Observable<object> {
        return this._http.get(environment.swapiBase + type);
    }

    getPlanets(): Observable<object> {
        return this._http.get(environment.swapiBase + 
                              environment.swapiPlanets);
    }

    getCharacters(): Observable<object> {
        return this._http.get(environment.swapiBase + 
                              environment.swapiPeople);
    }

    getSpecies(): Observable<object> {
        return this._http.get(environment.swapiBase +
                              environment.swapiSpecies);
    }

    getStarships(): Observable<object> {
        return this._http.get(environment.swapiBase +
                              environment.swapiShips);
    }

    getVehicles(): Observable<object> {
        return this._http.get(environment.swapiBase + 
                              environment.swapiVehicles);
    }

    genericFetch(url: string): Observable<object> {
        return this._http.get(url);
    }

    arrayFetch(urls: string[]): Observable<any> {
        let arr = [];
        for(let i of urls) {
            arr.push(this._http.get(i));
        }
        
        return forkJoin(arr);
    }

    /**
     * Searches api with given text and given type. 
     * @param searchText text to search for. 
     * @param type the search type.
     */
    search(searchText: string, type: string): Observable<any> {
        let url = `${environment.swapiBase}${type}/${environment.swapiSearch}${searchText}`;
        return this._http.get(url);
    }
}