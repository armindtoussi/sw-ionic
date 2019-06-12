import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//ENV config.
import { environment } from 'src/environments/environment';

//RXJS
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SwapiService {


    constructor(private _http: HttpClient) { }


    /**
     * Get request to swapi for star wars movie
     * information. 
     * 
     * @returns Observable<object> containing all results.
     */
    getSWMovies(): Observable<object> {
        return this._http.get(environment.swapiBase + 
                              environment.swapiMovies);
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
}