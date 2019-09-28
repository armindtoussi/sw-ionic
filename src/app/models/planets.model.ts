import { SWapiModel, SWapi } from './SWapi.model';

export interface PlanetsModel extends SWapiModel{
    results: Planet[];
}

export interface Planet extends SWapi{
    climate: string;
    diameter: string;
    films: string[];
    gravity: string;
    name: string;
    orbital_period: string;
    population: string;
    residents: string[];
    rotation_period: string;
    surface_water: string;
    terrain: string;
}