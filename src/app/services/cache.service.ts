import { Injectable } from '@angular/core';
//Services
import { StorageService } from './storage.service';
import { SwapiService } from './swapi.service';
//RXJS
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class CacheService {

    constructor(private _storage: StorageService,
                private _swapiService: SwapiService) { }

    
    public fetch(fetchArr: string[]): Observable<void> {
        return this._swapiService.arrayFetch(fetchArr);
    }

    public search(type: string, value: string): Observable<any> {
        let url = `${environment.swapiBase}${type}/${environment.swapiSearch}${value}`;        
        return this._swapiService.genericFetch(url);
    }

    public async fetchSingleEntry(id: any, key: string, valueKey: string): Promise<any> {
        return await this._storage.getSingleEntry(id, key, valueKey);
    }
}