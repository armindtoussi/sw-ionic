import { TestBed } from '@angular/core/testing';

import { CacheService } from './cache.service';
import { SwapiService } from './swapi.service';

describe('CacheService', () => {
    let cacheService: CacheService;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('SwapiService', ['search']);

        TestBed.configureTestingModule({
            providers: [
                CacheService,
                { provide: SwapiService, useValue: spy }
            ]
        });


    });
});