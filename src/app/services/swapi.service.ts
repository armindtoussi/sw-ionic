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


    /**
     * ctor, injects httpcleint for http requests.
     * @param http httpclient for requests.
     */
    constructor(private http: HttpClient) { }

    /**
     * Generic get method, pass in type for request.
     * @param type the type to fetch.
     */
    get(type: string): Observable<object> {
        return this.http.get(environment.swapiBase + type);
    }

    /**
     * Generic url fetch. Pass a url in, it'll fetch it.
     * @param url the url to issue get request with.
     */
    genericFetch(url: string): Observable<object> {
        if (url === null) { // To handle url null case on a next.
            return of(null);
        }
        return this.http.get(url);
    }
    /**
     * Generic fetch for an array of urls.
     * @param urls array of urls to fetch.
     */
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
