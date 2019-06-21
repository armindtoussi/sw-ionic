export interface StarshipsModel {
    count: number;
    next: string; 
    previous: string;
    results: Starship[];
}

export interface Starship {
    MGLT:                   string;
    cargo_capacity:         string;
    consumables:            string;
    cost_in_credits:        string;
    crew:                   string;
    films:                  string[];
    hyperdrive_rating:      string;
    length:                 string;
    manufacturer:           string;
    max_atmosphering_speed: string;
    model:                  string;
    name:                   string;
    passengers:             string;
    pilots:                 string[];
    starship_class:         string;
    url:                    string;
    created:                string;
    edited:                 string;
}