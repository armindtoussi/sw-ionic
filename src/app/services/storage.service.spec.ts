//Services.
import { StorageService } from "./storage.service";
import { FilmsModel } from '../models/films.model';
import { StorageStub } from '../testing/stub/storage.stub';


describe('StorageService', () => {
    let storageSpy: { get: jasmine.Spy };
    let storageService: StorageService;

    beforeEach(() => {
        storageSpy = jasmine.createSpyObj('Storage', ['set', 'get']);
        storageService = new StorageService(<any> storageSpy);
    });

    it('service should be truthy', () => {
        expect(storageService).toBeTruthy();
    });

    xit('should call addMovies', async () => {
        let movieObj: FilmsModel = {
            "count": 7,
            "next": null,
            "previous": null,
            "results": [
                {
                    "title": "A New Hope",
                    "episode_id": 4,
                    "opening_crawl": "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
                    "director": "George Lucas",
                    "producer": "Gary Kurtz, Rick McCallum",
                    "release_date": "1977-05-25",
                    "characters": [
                        "https://swapi.co/api/people/1/",
                        "https://swapi.co/api/people/2/",
                        "https://swapi.co/api/people/3/",
                        "https://swapi.co/api/people/4/",
                        "https://swapi.co/api/people/5/",
                        "https://swapi.co/api/people/6/",
                        "https://swapi.co/api/people/7/",
                        "https://swapi.co/api/people/8/",
                        "https://swapi.co/api/people/9/",
                        "https://swapi.co/api/people/10/",
                        "https://swapi.co/api/people/12/",
                        "https://swapi.co/api/people/13/",
                        "https://swapi.co/api/people/14/",
                        "https://swapi.co/api/people/15/",
                        "https://swapi.co/api/people/16/",
                        "https://swapi.co/api/people/18/",
                        "https://swapi.co/api/people/19/",
                        "https://swapi.co/api/people/81/"
                    ],
                    "planets": [
                        "https://swapi.co/api/planets/2/",
                        "https://swapi.co/api/planets/3/",
                        "https://swapi.co/api/planets/1/"
                    ],
                    "starships": [
                        "https://swapi.co/api/starships/2/",
                        "https://swapi.co/api/starships/3/",
                        "https://swapi.co/api/starships/5/",
                        "https://swapi.co/api/starships/9/",
                        "https://swapi.co/api/starships/10/",
                        "https://swapi.co/api/starships/11/",
                        "https://swapi.co/api/starships/12/",
                        "https://swapi.co/api/starships/13/"
                    ],
                    "vehicles": [
                        "https://swapi.co/api/vehicles/4/",
                        "https://swapi.co/api/vehicles/6/",
                        "https://swapi.co/api/vehicles/7/",
                        "https://swapi.co/api/vehicles/8/"
                    ],
                    "species": [
                        "https://swapi.co/api/species/5/",
                        "https://swapi.co/api/species/3/",
                        "https://swapi.co/api/species/2/",
                        "https://swapi.co/api/species/1/",
                        "https://swapi.co/api/species/4/"
                    ],
                    "created": "2014-12-10T14:23:31.880000Z",
                    "edited": "2015-04-11T09:46:52.774897Z",
                    "url": "https://swapi.co/api/films/1/"
                }
            ]
        };

        spyOn(storageService, 'addMovies').and.callThrough();
        await storageService.addMovies(movieObj);

        expect(storageService.addMovies).toHaveBeenCalled();
    }); 

    xit('should call, getMovies', async () => {
        spyOn(storageService, 'getMovies').and.callThrough();
        await storageService.getMovies();

        expect(storageService.getMovies).toHaveBeenCalled();
    });


    xit('should call, getMovies', (done: DoneFn) => {
        let movieObj: FilmsModel = {
            count: 1,
            next: null,
            previous: null,
            results: [
                {
                    "title": "A New Hope",
                    "episode_id": 4,
                    "opening_crawl": "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
                    "director": "George Lucas",
                    "producer": "Gary Kurtz, Rick McCallum",
                    "release_date": "1977-05-25",
                    "characters": [
                        "https://swapi.co/api/people/1/",
                        "https://swapi.co/api/people/2/",
                        "https://swapi.co/api/people/3/",
                        "https://swapi.co/api/people/4/",
                        "https://swapi.co/api/people/5/",
                        "https://swapi.co/api/people/6/",
                        "https://swapi.co/api/people/7/",
                        "https://swapi.co/api/people/8/",
                        "https://swapi.co/api/people/9/",
                        "https://swapi.co/api/people/10/",
                        "https://swapi.co/api/people/12/",
                        "https://swapi.co/api/people/13/",
                        "https://swapi.co/api/people/14/",
                        "https://swapi.co/api/people/15/",
                        "https://swapi.co/api/people/16/",
                        "https://swapi.co/api/people/18/",
                        "https://swapi.co/api/people/19/",
                        "https://swapi.co/api/people/81/"
                    ],
                    "planets": [
                        "https://swapi.co/api/planets/2/",
                        "https://swapi.co/api/planets/3/",
                        "https://swapi.co/api/planets/1/"
                    ],
                    "starships": [
                        "https://swapi.co/api/starships/2/",
                        "https://swapi.co/api/starships/3/",
                        "https://swapi.co/api/starships/5/",
                        "https://swapi.co/api/starships/9/",
                        "https://swapi.co/api/starships/10/",
                        "https://swapi.co/api/starships/11/",
                        "https://swapi.co/api/starships/12/",
                        "https://swapi.co/api/starships/13/"
                    ],
                    "vehicles": [
                        "https://swapi.co/api/vehicles/4/",
                        "https://swapi.co/api/vehicles/6/",
                        "https://swapi.co/api/vehicles/7/",
                        "https://swapi.co/api/vehicles/8/"
                    ],
                    "species": [
                        "https://swapi.co/api/species/5/",
                        "https://swapi.co/api/species/3/",
                        "https://swapi.co/api/species/2/",
                        "https://swapi.co/api/species/1/",
                        "https://swapi.co/api/species/4/"
                    ],
                    "created": "2014-12-10T14:23:31.880000Z",
                    "edited": "2015-04-11T09:46:52.774897Z",
                    "url": "https://swapi.co/api/films/1/"
                }
            ],
        };
        const storageIonicMock: any = {
            get: () => new Promise<any>((resolve, reject) => resolve(
                {
                    count: 1,
                    next: null,
                    previous: null,
                    results: [
                        {
                            "title": "A New Hope",
                            "episode_id": 4,
                            "opening_crawl": "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
                            "director": "George Lucas",
                            "producer": "Gary Kurtz, Rick McCallum",
                            "release_date": "1977-05-25",
                            "characters": [
                                "https://swapi.co/api/people/1/",
                                "https://swapi.co/api/people/2/",
                                "https://swapi.co/api/people/3/",
                                "https://swapi.co/api/people/4/",
                                "https://swapi.co/api/people/5/",
                                "https://swapi.co/api/people/6/",
                                "https://swapi.co/api/people/7/",
                                "https://swapi.co/api/people/8/",
                                "https://swapi.co/api/people/9/",
                                "https://swapi.co/api/people/10/",
                                "https://swapi.co/api/people/12/",
                                "https://swapi.co/api/people/13/",
                                "https://swapi.co/api/people/14/",
                                "https://swapi.co/api/people/15/",
                                "https://swapi.co/api/people/16/",
                                "https://swapi.co/api/people/18/",
                                "https://swapi.co/api/people/19/",
                                "https://swapi.co/api/people/81/"
                            ],
                            "planets": [
                                "https://swapi.co/api/planets/2/",
                                "https://swapi.co/api/planets/3/",
                                "https://swapi.co/api/planets/1/"
                            ],
                            "starships": [
                                "https://swapi.co/api/starships/2/",
                                "https://swapi.co/api/starships/3/",
                                "https://swapi.co/api/starships/5/",
                                "https://swapi.co/api/starships/9/",
                                "https://swapi.co/api/starships/10/",
                                "https://swapi.co/api/starships/11/",
                                "https://swapi.co/api/starships/12/",
                                "https://swapi.co/api/starships/13/"
                            ],
                            "vehicles": [
                                "https://swapi.co/api/vehicles/4/",
                                "https://swapi.co/api/vehicles/6/",
                                "https://swapi.co/api/vehicles/7/",
                                "https://swapi.co/api/vehicles/8/"
                            ],
                            "species": [
                                "https://swapi.co/api/species/5/",
                                "https://swapi.co/api/species/3/",
                                "https://swapi.co/api/species/2/",
                                "https://swapi.co/api/species/1/",
                                "https://swapi.co/api/species/4/"
                            ],
                            "created": "2014-12-10T14:23:31.880000Z",
                            "edited": "2015-04-11T09:46:52.774897Z",
                            "url": "https://swapi.co/api/films/1/"
                        }
                    ],
                }
            )),
        };
        const storeService = new StorageService(storageIonicMock);
        console.log("Mocking value ", storageIonicMock);
        console.log("Servicevalue: ", storeService);

        let spy = spyOn(storeService, 'getMovies').and
                    .returnValue(storageIonicMock.get);

        console.log("spy? ", spy.calls);
        spy.calls.mostRecent().returnValue.then((value) => {
            console.log("value: ", value);
            expect(value).toBe(movieObj.results);
            done();
        });
        
    });

    // it('should call getSingleEntry', () => {
    //     const storageIonicMock: any = {
    //         get: () => new Promise<any>((resolve, reject) => resolve(
    //                 { 
    //                     results: [
    //                         {
    //                             "1": "Value"
    //                         }
    //                     ]
    //                 }
    //             )),
    //     };
    //     let sService = new StorageService(storageIonicMock);

    //     // spyOn(sService, 'getSingleEntry').and.callThrough();
    //     expect(sService.getSingleEntry("Value", "key", "1"))
    //         .toBe(storageIonicMock.get(), 'Service returned mock value')
    //     // .then(value => {
    //         // console.log("Mock Value: ", value);
    //         // expect(value).toBe(storageIonicMock.get(), 'Service returned mock value');
    //     // }).catch(error => {
    //     //     console.log("Error handling ", error);
    //     // });
    //     expect(sService.getSingleEntry("1", "key", "value"))
    //         .toBe(storageIonicMock.get(), "Service returned mock value");
        
    // });
});