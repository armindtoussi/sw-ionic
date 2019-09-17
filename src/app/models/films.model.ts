import { SWapiModel, SWapi } from './SWapi.model';

export interface FilmsModel extends SWapiModel {
    results: Film[];
}

export interface Film extends SWapi {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
    characters: string[];
    planets: string[];
    starships: string[];
    vehicles: string[];
    species: string[];
}
