//Service
import { SwapiService } from './swapi.service';
//Testing Helpers
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, 
         HttpTestingController 
       } from '@angular/common/http/testing';

//Models
import { PlanetsModel }           from '../models/planets.model';
import { CharacterModel }         from '../models/character.model';
import { FilmsModel, Film }       from '../models/films.model';
import { SpeciesModel }           from '../models/species.model';
import { StarshipsModel }         from '../models/starships.model';
import { VehiclesModel, Vehicle } from '../models/vehicles.model';
import { environment } from 'src/environments/environment';


describe('SwapiService', () => {
    let service: SwapiService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SwapiService]
        });
        //Gets instance of service. 
        service = TestBed.get(SwapiService);
        // Inject http service and test controller fo reach test. 
        httpTestingController = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        //Clean up any remaining requests.
        httpTestingController.verify();
    });

    it('should return movies(calls getSWMovies)', fakeAsync(() => {
        let mockRes = {
            "count": 1,
            "next": null,
            "previous": null,
            "results": [
                {
                    "title": "thetitle",
                    "episode_id": 1,
                    "opening_crawl": "the crawl goes here",
                    "director": "me!",
                    "producer": "me!?",
                    "release_date": "1977-05-25",
                    "characters": ["fake.chars.com"],
                    "planets": ["fake.planets.url"],
                    "starships": ["fake.ships.url"],
                    "vehicles": ["fake.vehicles.url"], 
                    "species": ["fake.species.url"],
                    "created": "2014-12-10T14:23:31.880000Z",
                    "edited": "2015-04-11T09:46:52.774897Z",
                    "url": "fake.films.url"
                }
            ]
        };
        // Create cold observable
        let $res = service.getSWMovies();
        // Subscribe to cold obs, making it hot observable.
        $res.subscribe(response => {
                expect(response['results'].length).toBe(1);
                expect(response).toEqual(mockRes);
        });
        // Tick once async resolved.
        tick();
        // http testing controller intercepts calls and response. 
        const req = httpTestingController.expectOne(environment.swapiBase + environment.swapiMovies);
        // Checking for request type to == GET.
        expect(req.request.method).toEqual('GET');
        // Resolves the fake request by responding with fake object we created. 
        req.flush(mockRes);
    }));

    it('should return planets(calls getPlanets)', fakeAsync(() => {
        let mockRes = {
            "count": 1,
            "next": null,
            "previous": null,
            "results": [
                {
                    "name": "Planet1",
                    "rotation_period": "the rotation",
                    "orbital_period": "the orbit",
                    "diameter": "the diameter",
                    "climate": "sunnyyy",
                    "gravity": "it's grav",
                    "terrain": "grassy knowles",
                    "surface_water": "it's wata",
                    "population": "1 million dollars",
                    "residents": ["fake.resident.url"],
                    "films": ["fake.films.url"],
                    "created": "2014-12-10T11:35:48.479000Z",
                    "edited": "2014-12-20T20:58:18.420000Z",
                    "url": "https://swapi.co/api/planets/2/",
                }
            ]
        };

        let $res = service.getPlanets();

        $res.subscribe(response => {
            expect(response['results'].length).toBe(1);
            expect(response).toEqual(mockRes);
        });

        tick();

        const req = httpTestingController.expectOne(environment.swapiBase + environment.swapiPlanets);

        expect(req.request.method).toEqual('GET');

        req.flush(mockRes);
    }));

    it('should return characters(calls getCharacters)', fakeAsync(() => {
        let mockRes = {
            "count": 1,
            "next": null,
            "previous": null,
            "results": [
                {
                    "name": "lukey",
                    "height": "some height",
                    "mass": "i'm phat",
                    "hair_color": "grack",
                    "skin_color": "purpilingo",
                    "eye_color": "yellange",
                    "birth_year": "1",
                    "gender": "maleelf",
                    "homeworld": "fake.planet.url",
                    "films": ["fake.film.url"],
                    "species": ["fake.species.url"],
                    "vehicles": ["fake.vehicles.url"],
                    "starships": ["fake.starships.url"],
                    "created": "2014-12-09T13:50:51.644000Z",
                    "edited": "2014-12-20T21:17:56.891000Z",
                    "url": "https://swapi.co/api/people/1/"
                }
            ]
        };

        let $res = service.getCharacters();

        $res.subscribe(response => {
            expect(response['results'].length).toBe(1);
            expect(response).toEqual(mockRes);
        });

        tick();

        const req = httpTestingController.expectOne(environment.swapiBase + environment.swapiPeople);

        expect(req.request.method).toEqual('GET');

        req.flush(mockRes);
    }));

    it('should return species(calls getSpecies)', fakeAsync(() => {
        let mockRes = {
            "count": 1,
            "next": null,
            "previous": null,
            "results": [
                {
                    "name": "hurt",
                    "classification": "gastropedro",
                    "designation": "sentient",
                    "average_height": "300",
                    "skin_colors": "green, brown, tan",
                    "hair_colors": "n/a",
                    "eye_colors": "yellow, red",
                    "average_lifespan": "1000",
                    "homeworld": "fake.planet.url",
                    "language": "Huttese",
                    "people": ["fake.character.url"],
                    "films": ["fake.films.url"],
                    "created": "2014-12-10T17:12:50.410000Z",
                    "edited": "2014-12-20T21:36:42.146000Z",
                    "url": "https://swapi.co/api/species/5/"
                }
            ]
        };

        let $res = service.getSpecies();

        $res.subscribe(response => {
            expect(response['results'].length).toBe(1);
            expect(response).toEqual(mockRes);
        });

        tick();

        const req = httpTestingController.expectOne(environment.swapiBase + environment.swapiSpecies);

        expect(req.request.method).toEqual('GET');

        req.flush(mockRes);
    }));
    
    it('should return starships(calls getStarships)', fakeAsync(() => {
        let mockRes = {
            "count": 1,
            "next": null,
            "previous": null,
            "results": [
                {
                    "name": "Executor",
                    "model": "Executor-class star dreadnought",
                    "manufacturer": "Kuat Drive Yards, Fondor Shipyards",
                    "cost_in_credits": "1143350000",
                    "length": "19000",
                    "max_atmosphering_speed": "n/a",
                    "crew": "279144",
                    "passengers": "38000",
                    "cargo_capacity": "250000000",
                    "consumables": "6 years",
                    "hyperdrive_rating": "2.0",
                    "MGLT": "40",
                    "starship_class": "Star dreadnought",
                    "pilots": ["fake.pilot.url"],
                    "films": ["fake.films.url"],
                    "created": "2014-12-15T12:31:42.547000Z",
                    "edited": "2017-04-19T10:56:06.685592Z",
                    "url": "https://swapi.co/api/starships/15/"
                }
            ]
        };

        let $res = service.getStarships();

        $res.subscribe(response => {
            expect(response['results'].length).toBe(1);
            expect(response).toEqual(mockRes);
        });

        tick();

        const req = httpTestingController.expectOne(environment.swapiBase + environment.swapiShips);
 
        expect(req.request.method).toEqual('GET');

        req.flush(mockRes);
    }));

    it('should return vehicles(calls getVehicles)', fakeAsync(() => {
        let mockRes = {
            "count": 1,
            "next": null,
            "previous": null,
            "results": [
                {
                    "name": "Sand Crawler",
                    "model": "Digger Crawler",
                    "manufacturer": "Corellia Mining Corporation",
                    "cost_in_credits": "150000",
                    "length": "36.8",
                    "max_atmosphering_speed": "30",
                    "crew": "46",
                    "passengers": "30",
                    "cargo_capacity": "50000",
                    "consumables": "2 months",
                    "vehicle_class": "wheeled",
                    "pilots": [],
                    "films": [
                        "fake.film.url"
                    ],
                    "created": "2014-12-10T15:36:25.724000Z",
                    "edited": "2014-12-22T18:21:15.523587Z",
                    "url": "https://swapi.co/api/vehicles/4/"
                }
            ]
        };

        let $res = service.getVehicles();

        $res.subscribe(response => {
            expect(response['results'].length).toBe(1);
            expect(response).toEqual(mockRes);
        });

        tick();

        const req = httpTestingController.expectOne(environment.swapiBase + environment.swapiVehicles);
 
        expect(req.request.method).toEqual('GET');

        req.flush(mockRes);
    }));

    it('should return data from url (calls genericFetch)', fakeAsync(() => {
        let mockRes = {
            "name": "R2-D2",
            "height": "96",
            "mass": "32",
            "hair_color": "n/a",
            "skin_color": "white, blue",
            "eye_color": "red",
            "birth_year": "33BBY",
            "gender": "n/a",
            "homeworld": "fake.planet.url",
            "films": ["fake.person.url"],
            "species": [
                "https://swapi.co/api/species/2/"
            ],
            "vehicles": [],
            "starships": [],
            "created": "2014-12-10T15:11:50.376000Z",
            "edited": "2014-12-20T21:17:50.311000Z",
            "url": "fake.r2d2.url"      
        };

        let url = "fake.generic.url";
        let $res = service.genericFetch(url);

        $res.subscribe(response => {
            expect(response).not.toBeNull();
            expect(response).toEqual(mockRes);
        });

        tick();

        const req = httpTestingController.expectOne(url);
        expect(req.request.method).toEqual('GET');

        req.flush(mockRes);
    })); 

    // This is new. Testing multiple requests or complex/chained async calls.
    it('should return data from array of urls (calls arrayFetch)', fakeAsync(() => {
        let mockRes  = { "code": "200", "res": "nice response" };
        let mockRes2 = { "code": "200", "res": "also nice response" };

        let urls = ["https://fake.data.url/people/1", "https://fake.data2.url/people/2"];
        let $res = service.arrayFetch(urls);

        $res.subscribe(response => {
            expect(response).not.toBeNull();
            expect(response.length).toBe(2);
            expect(response).toEqual([mockRes, mockRes2]);
        });

        tick();

        const calls = httpTestingController.match((request) => {
            return request.url.match(/people/) && request.method === 'GET';
        });

        expect(calls.length).toBe(2);
        expect(calls[0].request.url).toEqual(urls[0]);
        expect(calls[1].request.url).toEqual(urls[1]);

        calls[0].flush(mockRes);
        calls[1].flush(mockRes2);
    }));

    it('should return search result (calls search)', fakeAsync(() => {
        let mockRes = {
            "count": 2,
            "next": null,
            "previous": null,
            "results": [
                {
                    "name": "luke"
                },
                {
                    "name": "luminara"
                }
            ],
        };

        let searchText = "lu";
        let $res = service.search(searchText, environment.swapiPeople);

        $res.subscribe(response => {
            expect(response).not.toBeNull();
            expect(response).toEqual(mockRes);
        });

        tick();

        const req = httpTestingController.expectOne(environment.swapiBase 
                                                  + environment.swapiPeople 
                                                  + "/"
                                                  + environment.swapiSearch
                                                  + searchText);
                                    
        expect(req.request.method).toEqual('GET');

        req.flush(mockRes);
    }));
});

