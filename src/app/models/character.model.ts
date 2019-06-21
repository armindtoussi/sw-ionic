export interface CharacterModel {
    count:    number;
    next:     string;
    previous: string;
    results:  Character[];
}

export interface Character {
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
    url:        string;
    vehicles:   string[];
    created:    string;
    edited:     string;
}