import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

//models
import { FilmsModel, Film } from '../models/films.model';
import { CharacterModel, Character } from '../models/character.model';
import { element } from '@angular/core/src/render3';


const MOVIES_KEY     = "sw-movies";
const CHARACTERS_KEY = "sw-characters";    


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

    addCharacters(characters: CharacterModel): Promise<void> {
        return this.storage.set(CHARACTERS_KEY, characters);
    }

    //TODO - FIX THIS GARBAGE. 
    addCharacter(character: Character): Promise<void> {
        return this.storage.get(CHARACTERS_KEY).then((characters: CharacterModel) =>{
            if(characters) {
                let search = characters.results.find((element: any) => {
                    return element.name === character.name;
                });
                console.log("Search? ", search);
                if(search) {
                    return;
                } else {
                    characters.results.push(character);
                }
            }
        });
    }
}