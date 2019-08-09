import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

//models
import { FilmsModel, Film } from '../models/films.model';
//Env
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StorageService {


    constructor(private storage: Storage) { }
    
    /**
     * Adds entire array of movies fetched from api. 
     * @param films the movies to add. 
     */
    async addMovies(films: FilmsModel): Promise<any> {
        return this.storage.set(environment.MOVIES_KEY, films);
    }

    /**
    //  * Adds individual movies to the store.
    //  * @param film the movie to add. 
    //  */
    // async addMovie(film: FilmsModel): Promise<any> { // TODO - not so sure about this one. 
    //     return this.storage.get(environment.MOVIES_KEY).then((films: FilmsModel[]) => {
    //         if(films) {
    //             films.push(film);
    //             return this.storage.set(environment.MOVIES_KEY, films);
    //         } else {
    //             return this.storage.set(environment.MOVIES_KEY, [films]);
    //         }
    //     });
    // }

    //get all movie list.
    async getMovies(): Promise<Film[] | null> {
        const films = await this.storage.get(environment.MOVIES_KEY);
        if (films && films.count && films.results.length === films.count) {
            return films.results;
        }
        else {
            return null;
        }
    }

    // //get single movie
    // async getMovie(id: number):Promise<Film> {
    //     return this.storage.get(environment.MOVIES_KEY).then((films: FilmsModel) => {
    //         if(films) {
    //             return films.results.find((element) => {
    //                 return element.episode_id === id;
    //             });
    //         } else {
    //             return null;
    //         }
    //     });
    // }

    async getSingleEntry(id: any, key: string, valueKey: string): Promise<any> {
        return this.storage.get(key).then((result: any) => {
            if(result) {
                return result.results.find((element: any) => { 
                    return element[valueKey] === id;
                });
            } else {
                return null;
            }
        })
    }

    // async addFullDictionary(dictionary: object, key: string): Promise<any> {
    //     // return this.storage.set(key, dictionary);
    //     return await this.storage.get(key).then((dict: object) => {
    //         console.log("dict: ", dict);
    //         return this.storage.set(key, dictionary);
    //     });
    // }

    // async addSingleEntry(entry: any, key: string): Promise<void> {
    //     return await this.storage.set(key, entry);
    // }

    // async addIndividualDictionary(entry: any, key: string): Promise<void> {
    //     return await this.storage.get(key).then((dict: object) => {
    //         console.log("Dict: ", dict);
    //         if(!dict) {
    //             dict = {};
    //         }
    //         dict[entry.url] = entry;
    //         return this.storage.set(key, dict);
    //     });
    // }

    // async getFullDictionary(key: string): Promise<any> {
    //     const dictionary = await this.storage.get(key);
    //     return dictionary;
    // }
}