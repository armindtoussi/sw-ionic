//Services.
import { StorageService } from "./storage.service";
import { FilmsModel } from '../models/films.model';
import { StorageStub } from '../testing/stub/storage.stub';
import { fakeAsync } from '@angular/core/testing';


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

    xit('should add movies(calls addMovies)', fakeAsync(() => {
        let mockRes = {
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
                    "characters": [ "fake.people.url" ],
                    "planets": [ "fake.planets.url" ],
                    "starships": [ "fake.starships.url" ],
                    "vehicles": [ "fake.vehicles.url" ],
                    "species": [ "fake.species.url" ],
                    "created": "2014-12-10T14:23:31.880000Z",
                    "edited": "2015-04-11T09:46:52.774897Z",
                    "url": "https://swapi.co/api/films/1/"
                }
            ]
        }
        spyOn(storageService, 'addMovies');
        storageService.addMovies(mockRes);
    }));
});