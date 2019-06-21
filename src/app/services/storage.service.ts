import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

//models
import { FilmsModel, Film } from '../models/films.model';
//Env
import { environment } from 'src/environments/environment';

const SHIPS_DICT_KEY   = "sw-ships-dict";

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
     * Adds individual movies to the store.
     * @param film the movie to add. 
     */
    async addMovie(film: FilmsModel): Promise<any> { // TODO - not so sure about this one. 
        return this.storage.get(environment.MOVIES_KEY).then((films: FilmsModel[]) => {
            if(films) {
                films.push(film);
                return this.storage.set(environment.MOVIES_KEY, films);
            } else {
                return this.storage.set(environment.MOVIES_KEY, [films]);
            }
        });
    }

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

    //get single movie
    async getMovie(id: number):Promise<Film> {
        return this.storage.get(environment.MOVIES_KEY).then((films: FilmsModel) => {
            if(films) {
                return films.results.find((element) => {
                    return element.episode_id === id;
                });
            } else {
                return null;
            }
        });
    }

    async addFullDictionary(dictionary: object, key: string): Promise<any> {
        return this.storage.set(key, dictionary);
    }

    async getFullDictionary(key: string): Promise<any> {
        const dictionary = await this.storage.get(key);
        return dictionary;
        //no need to check for existance, it's doing that in the component.
    }
}


    // async addCharacterDict(character: Character): Promise<any> {
    //     console.log("is this even being called ? ", character);
    //     return this.storage.get(CHARS_DICT_KEY).then((characters: any) => {
    //         console.log("Characters before: ", characters);
    //         if(!characters) {
    //             characters = {};
    //             characters[character.url] = character; 
    //             console.log("Characters After adding: ", characters);
    //             return this.storage.set(CHARS_DICT_KEY, characters);
    //         } else {
    //             characters[character.url] = character; 
    //             console.log("Meow: ", characters)
    //             return this.storage.set(CHARS_DICT_KEY, characters);
    //         }
    //     });
    // }

    // async addCharacters(characters: CharacterModel): Promise<void> {
    //     return this.storage.set(CHARACTERS_KEY, characters);
    // }

    // //TODO - FIX THIS GARBAGE. 
    // async addCharacter(character: Character): Promise<void> {
    //     return this.storage.get(CHARACTERS_KEY).then((characters: CharacterModel) =>{
    //         if(characters) {
    //             let search = characters.results.find((element: any) => {
    //                 return element.name === character.name;
    //             });
    //             console.log("Search? ", search);
    //             if(search) {
    //                 return;
    //             } else {
    //                 characters.results.push(character);
    //             }
    //         }
    //     });
    // }