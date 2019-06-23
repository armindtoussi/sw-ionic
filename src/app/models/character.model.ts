import { SWapiModel, SWapi } from './SWapi.model';

export interface CharacterModel extends SWapiModel {
    results:  Character[];
}

export interface Character extends SWapi {
    birth_year: string;
    eye_color:  string; 
    films:      string[];
    gender:     string;
    hair_color: string;
    height:     string;
    homeworld:  string;
    name:       string;
    mass:       string;
    skin_color: string;
    species:    string[];
    starships:  string[];
    vehicles:   string[];
}