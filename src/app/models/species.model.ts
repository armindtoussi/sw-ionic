import { SWapiModel, SWapi } from './SWapi.model';

export interface SpeciesModel extends SWapiModel {
    results:  Species[];
}

export interface Species extends SWapi {
    average_height:   string;
    average_lifespan: string;
    classification:   string;
    designation:      string;
    eye_colors:       string;
    films:            string[];
    hair_colors:      string;
    homeworld:        string;
    language:         string;
    name:             string;
    people:           string[];
    skin_colors:      string;
}