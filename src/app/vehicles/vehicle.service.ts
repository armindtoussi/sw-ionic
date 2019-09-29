// Ng
import { Injectable } from '@angular/core';
// Models
import { Vehicle, VehiclesModel } from '../models/vehicles.model';
// Services
import { SwapiService } from '../services/swapi.service';
// Env
import { environment } from 'src/environments/environment';
// Rxjs
import { Observable, UnaryFunction, pipe } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';


/**
 * Vehicle Service implementation acts as a layer
 * between vehicle component and SWapi wrapper.
 */
@Injectable()
export class VehicleService {
    /** Holds the url for the next page of results. */
    private nextUrl: string;
    /** Holds the total count of results for a given query. */
    private count: number;
    /** Holds the results of queries. */
    private vehicles: Vehicle[];

    /**
     * ctor, injects dependencies.
     * @param swService sw api wrapper.
     */
    constructor(private swService: SwapiService) { }


    /**
     * Gets Vehicles via swapi service.
     * @returns a sorted array of Vehicles objects.
     */
    getVehicles(): Observable<Vehicle[]> {
        return this.swService.get(environment.swapiVehicles)
            .pipe(
                this.mapAndFetch(),
                this.mapSetAndReturn(),
            );
    }

    /**
     * Loads more results either from search or basic
     * character load functionality.
     * @returns a sorted array of Character objects.
     */
    loadMore(): Observable<Vehicle[]> {
        return this.swService.genericFetch(this.nextUrl)
            .pipe(
                this.mapNextAndReturn(),
            );
    }

    /**
     * Searches the swapi people for the given text.
     * @param searchText the text to search for.
     */
    search(searchText: string): Observable<Vehicle[]> {
        const url = `${environment.swapiBase}${environment.swapiVehicles}${environment.swapiSearch}${searchText}`;
        return this.swService.genericFetch(url)
            .pipe(
                this.mapAndFetch(),
                this.mapSetAndReturn(),
            );
    }

    /**
     * Fetches a single Vehicle by id.
     * @param id the Vehicle id to fetch.
     */
    fetchVehicle(id: string): Observable<Vehicle> {
        const url = `${environment.swapiBase}${environment.swapiVehicles}${environment.swapiSearch}${id}`;
        return this.swService.genericFetch(url)
            .pipe(
                map((res: VehiclesModel) => res.results[0]),
            );
    }

    /**
     * Fetches array of data of a particular type.
     * @param arr array of urls to fetch.
     */
    fetchArrayData(arr: string[]): Observable<object[]> {
        return this.swService.arrayFetch(arr);
    }

    /**
     * exposes the nextUrl field for reading.
     */
    hasNext(): string | null {
        return this.nextUrl;
    }

    /**
     * exposes the count field for reading.
     */
    getCount(): number {
        return this.count;
    }

    /**
     * Custom operator, maps the url, count, and characters,
     * sorts and returns the character stream.
     */
    private mapAndFetch(): UnaryFunction<Observable<VehiclesModel>, Observable<object>> {
        return pipe(
            map((res: VehiclesModel) => {
                this.nextUrl = res.next;
                this.vehicles = res.results;
            }),
            map(() => this.swService.genericFetch(this.nextUrl)),
            flatMap(res => res),
        );
    }

    /**
     * Custom operator, maps the url and characters,
     * sorts and returns the character stream out of the pipe.
     */
    private mapSetAndReturn(): any {
        return pipe(
            map((res: VehiclesModel) => {
                if (res === null || res === undefined) {
                    return this.vehicles;
                }
                this.nextUrl = res.next;
                this.count = res.count;
                this.vehicles = this.vehicles.concat(res.results)
                                             .sort((a: Vehicle,
                                                    b: Vehicle) =>
                                                    this.sortArr(a.name, b.name));
                return this.vehicles;
            })
        );
    }

    /**
     * Custom operator, maps the url and characters,
     * sorts and returns the character stream out of the pipe.
     */
    private mapNextAndReturn(): UnaryFunction<Observable<VehiclesModel>, Observable<Vehicle[]>> {
        return pipe(
            map((res: VehiclesModel) => {
                this.nextUrl = res.next;
                this.vehicles = this.vehicles.concat(res.results)
                                    .sort((a: Vehicle,
                                           b: Vehicle) =>
                                           this.sortArr(a.name, b.name));
                return this.vehicles;
            })
        );
    }

    /**
     * string compare function.
     * @param a string to sort.
     * @param b string to sort.
     */
    public sortArr(a: string, b: string): number {
        return (a).localeCompare(b);
    }
}
