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

    //get all movie list.
    async getMovies(): Promise<Film[]> {
        const films = await this.storage.get(environment.MOVIES_KEY);
        return films.results; 
    }

    async getSingleEntry(id: any, key: string, valueKey: string): Promise<any> {
        return this.storage.get(key).then((result: any) => {
            if(result && valueKey) {
                return result.results.find((element: any) => { 
                    return element[valueKey] == id;
                });
            } else {
                return null;
            }
        });
    }
}