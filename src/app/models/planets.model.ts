export interface PlanetsModel {
    count:    number;
    next:     string; 
    previous: string;
    results:  Planet[];
}

export interface Planet {
    climate:         string;
    diameter:        string;
    films:           string[];
    gravity:         string;
    name:            string;
    orbital_period:  string;
    population:      string;
    residents:       string[];
    rotation_period: string;
    surface_water:   string;
    terrain:         string;
    url:             string;
    created:         string;
    edited:          string;
}