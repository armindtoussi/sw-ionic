import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

//models
import { FilmsModel, Film } from '../models/films.model';


const MOVIES_KEY = "sw-movies";

@Injectable({
    providedIn: 'root'
})
export class StorageService {


    constructor(private storage: Storage) { }

    /**
     * Adds entire array of movies fetched from api. 
     * @param films the movies to add. 
     */
    addMovies(films: FilmsModel): Promise<any> {
        return this.storage.set(MOVIES_KEY, films);
    }

    /**
     * Adds individual movies to the store.
     * @param film the movie to add. 
     */
    addMovie(film: FilmsModel): Promise<any> { // TODO - not so sure about this one. 
        return this.storage.get(MOVIES_KEY).then((films: FilmsModel[]) => {
            if(films) {
                films.push(film);
                return this.storage.set(MOVIES_KEY, films);
            } else {
                return this.storage.set(MOVIES_KEY, [films]);
            }
        });
    }

    //get all movie list.
    getMovies(): Promise<Film[] | null> {
        return this.storage.get(MOVIES_KEY).then((films: FilmsModel) => {
            if(films && films.count && films.results.length === films.count) {
                return films.results;
            } else {
                return null;
            }
        });
    }

    //get single movie
    getMovie(id: number):Promise<Film> {
        return this.storage.get(MOVIES_KEY).then((films: FilmsModel) => {
            if(films) {
                return films.results.find((element) => {
                    return element.episode_id === id;
                });
            } else {
                return null;
            }
        });
    }

    update(data: any) {

    }
}