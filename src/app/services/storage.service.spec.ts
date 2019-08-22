//Services.
import { StorageService } from "./storage.service";
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Storage } from '@ionic/storage';
//MockData
import filmsJSON from '../testing/data/movies.json';

class StorageMock {
    constructor() { }

    set(key: string, value: object) {
        return Promise.resolve(true);
    }

    get(key: string): Promise<any> {
        if(key) {
            return Promise.resolve(filmsJSON);
        }
    }
}

describe('StorageService', () => {
    let storage: Storage;
    let storageService: StorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
            providers: [
                { provide: Storage, useClass: StorageMock },
            ],
        });
    });

    beforeEach(() => {
        storage = TestBed.get(Storage);
        storageService = TestBed.get(StorageService);
    });

    it('service should be truthy', () => {
        expect(storageService).toBeTruthy();
    });

    it('[#addMovies] should add movies to storage', fakeAsync(() => {
        let spy = spyOn(storage, 'set').and.callThrough();
        let sSpy = spyOn(storageService, 'addMovies').and.callThrough();

        storageService.addMovies(filmsJSON);

        tick();

        expect(spy).toHaveBeenCalled();
        expect(sSpy).toHaveBeenCalled();
    }));

    it('[#getMovies] should get filmsJSON back from mock storage', fakeAsync(() => {
        let spy = spyOn(storage, 'get').and.callThrough();

        storageService.getMovies().then(response => {
            expect(response).toEqual(filmsJSON.results);
        });

        tick();

        expect(spy).toHaveBeenCalled();
    }));

    it('[#getSingleEntry] should fetch a single entry from storage', fakeAsync(() => {
        let spy = spyOn(storage, 'get').and.callThrough();

        storageService.getSingleEntry('4', "4", "episode_id").then(response => {
            expect(response).toEqual(filmsJSON.results[3]);
        });

        tick();

        expect(spy).toHaveBeenCalled();
    }));

    it('[#getSingleEntry] should fail to fetch a single entry and return null', fakeAsync(() => {
        let spy = spyOn(storage, 'get').and.callThrough();

        storageService.getSingleEntry("4", "4", undefined).then(response => {
            expect(response).toBeNull();
        }); 

        expect(spy).toHaveBeenCalled(); 
    }));
});