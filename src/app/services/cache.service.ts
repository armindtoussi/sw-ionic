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

    // public async cacheAll(array: SWapi[], key: string): Promise<void> {
    //     let obj = {};

    //     for(let i of array) {
    //         obj[i.url] = i;
    //     }

    //     return this._storage.addFullDictionary(obj, key);
    // }

    // public async cacheArray(array: any[]): Promise<any[]> {
    //     let promises = [];
    //     for(let i of array) {
    //         let promise = this._storage.addSingleEntry(i, i.url);
    //         promises.push(promise);
    //     }
    //     return Promise.all(promises);
    // }

    // public async fetchFromUrls(urlArr: string[], dataArray: SWapi[]): Promise<any[]> {
    //     return await this._swapiService.arrayFetch(urlArr).toPromise().then(
    //         (data: any) => {
    //             return dataArray.concat(...data);
    //         }
    //     );
    // }

    // public async fetchType(data: any[], key: string): Promise<any[]> {
    //     let type = [];

    //     return await this._storage.getFullDictionary(key)
    //         .then((types: any) => {
    //             if(types) {
    //                 let fetchArr = this.compareFetch(types, data);
    //                 type = this.filterDictionary(types, data);
    //                 console.log("type: ", type);

    //                 return this.fetchFromUrls(fetchArr, type);
    //             }
    //         }).then((result) => {
    //             console.log("fetchType(): result: ", result);
    //             type = result;
    //             if(type)
    //                 this.cacheArray(type);

    //             return type;
    //         });
    // }

    // private compareFetch(dictionary: object, arr: any[]): string[] {
    //     let fetchArr = [];
    
    //     for(let a of arr) {
    //       if(!dictionary[a]) {
    //         fetchArr.push(a);
    //       }
    //     }
    //     return fetchArr;
    // }

    // private filterDictionary(dictionary: object, urls: string[]): SWapi[] {
    //     let arr = [];
    
    //     for(let url of urls) {
    //       if(dictionary[url]) {
    //         arr.push(dictionary[url]);
    //       }
    //     }
    
    //     return arr;
    // }
}