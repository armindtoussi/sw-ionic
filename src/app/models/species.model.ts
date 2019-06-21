export interface SpeciesModel {
    count:    number;
    next:     string;
    previous: string; 
    results:  Species[];
}

export interface Species {
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
    url:              string;
    created:          string;
    edited:           string;
}