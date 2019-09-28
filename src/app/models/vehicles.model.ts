import { SWapiModel, SWapi } from './SWapi.model';

export interface VehiclesModel extends SWapiModel {
    results: Vehicle[];
}

export interface Vehicle extends SWapi {
    cargo_capacity: string;
    consumables: string;
    cost_in_credits: string;
    crew: string;
    films: string[];
    length: string;
    manufacturer: string;
    max_atmosphering_speed: string;
    model: string;
    name: string;
    passengers: string;
    pilots: string[];
    vehicle_class: string;
}