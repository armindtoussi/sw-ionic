import { TestBed, fakeAsync, tick } from '@angular/core/testing';
//Services
import { CacheService } from './cache.service';
import { SwapiService } from './swapi.service';
import { StorageService } from './storage.service';
//ENV
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';

describe('CacheService', () => {
    
    let _cacheService: CacheService;
    let storeServiceSpy: { getSingleEntry: jasmine.Spy };
    let swapiServiceSpy: { genericFetch: jasmine.Spy, arrayFetch: jasmine.Spy };

    beforeEach(() => {
        storeServiceSpy = jasmine.createSpyObj('StorageService', ['getSingleEntry']);
        swapiServiceSpy = jasmine.createSpyObj('SwapiService', ['genericFetch', 'arrayFetch']);
        _cacheService = new CacheService(<any>storeServiceSpy, <any>swapiServiceSpy);
    });

    it('[#fetchSingleEntry] should fetch and return a single entry', fakeAsync(() => {
        let mockRes = { "response": "test" };

        storeServiceSpy.getSingleEntry.and.returnValue(mockRes);

        _cacheService.fetchSingleEntry("id", "key", "valueKey").then(response => {
            expect(response).toEqual(mockRes);
        });

        tick();

        expect(storeServiceSpy.getSingleEntry.calls.count()).toBe(1);
        expect(storeServiceSpy.getSingleEntry.calls.mostRecent().returnValue)   
            .toBe(mockRes);

    }));

    it('[#search] should search and return entry', fakeAsync(() => {
        let mockRes = { "response": "it's a test response" };
        let $obs = of(mockRes);

        swapiServiceSpy.genericFetch.and.returnValue($obs);

        let $res = _cacheService.search(environment.swapiPeople, "Luke");
        
        $res.subscribe(response => {
            expect(response).toEqual(mockRes);
        })

        tick(); 

        expect(swapiServiceSpy.genericFetch.calls.count()).toBe(1);
        expect(swapiServiceSpy.genericFetch.calls.mostRecent().returnValue)
            .toBe($obs);
    }));

    it('[#fetch] should array fetch and return an array of values', fakeAsync(() => {
        let mockRes = [ {"response" : "test1" }, { "response": "test2"} ];
        let $obs = of(mockRes);

        swapiServiceSpy.arrayFetch.and.returnValue($obs);

        let $res = _cacheService.fetch(["fake.people.url/1/", "fake.people.url/2/"]);

        $res.subscribe(response => {
            expect(response).toEqual(mockRes);
        });

        tick();

        expect(swapiServiceSpy.arrayFetch.calls.count()).toBe(1);
        expect(swapiServiceSpy.arrayFetch.calls.mostRecent().returnValue)
            .toBe($obs);
    }));    
});