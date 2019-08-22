//Ng
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//Testing
import { async, ComponentFixture, 
         TestBed, inject, 
         fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
//Page
import { SpeciesPage } from './species.page';
//Service
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';
//Model
import { Planet } from '../models/planets.model';
//Rxjs
import { of } from 'rxjs';
//MockData
const spec1JSON = require('../testing/data/species.json');
const spec2JSON = require('../testing/data/species2.json');

describe('SpeciesPage', () => {
  let component: SpeciesPage;
  let fixture: ComponentFixture<SpeciesPage>;
  let swapiService: SwapiService;
  let dataService: DataService;
  let res = spec1JSON.results;

  res = res.concat(spec2JSON.results).sort((a: Planet, b: Planet) => {
    return (a.name).localeCompare(b.name);
  });

  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeciesPage ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        SwapiService,
        DataService,
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {}, data: {} }
          }
        }
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(
    inject([SwapiService, DataService],
           (swService: SwapiService, dServe: DataService) => {
      swapiService = swService;
      dataService = dServe;
      fixture = TestBed.createComponent(SpeciesPage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.speciesSub = [];
  }));

  afterEach(() => {
    component.unsubscribe();
    fixture = null;
    component = null;
  });

  it('should create the Species page', () => {
    expect(component).toBeTruthy();
  });

  it('[#search] should call resetSearch', () => {
    expect(component.isSearch).toBeUndefined();
    let spy = spyOn(component, 'resetSearch');

    component.search();

    expect(spy).toHaveBeenCalled();
    expect(component.species).toBeUndefined();
  });

  it('[#search] should return search results and set properties', fakeAsync(() => {
    expect(component.isSearch).toBeUndefined();
    expect(component.nextUrl).toBeUndefined();

    let spy = spyOn(swapiService, 'search').and.returnValue(of(spec1JSON));
    component.searchText = 'hu';
    component.search();

    tick();

    expect(spy).toHaveBeenCalled();
    expect(component.isSearch).toBe(true);
    expect(component.nextUrl).not.toBeUndefined();
    expect(component.species).toEqual(spec1JSON.results);
  }));

  it('[#resetSearch] should reset isSearch and grab species', fakeAsync(() => {
    spyOn(component, 'getSpecies').and.returnValue(spec1JSON);
    component.isSearch = true;
    component.resetSearch();

    tick();

    expect(component.isSearch).toBe(false);
    expect(component.isSearch).toBeFalsy();
    expect(component.species).not.toBeNull();
  }));

  it('[#displaySpecies] should set data in service, and navigate', () => {
    let spy = spyOn(dataService, 'setData').and.callThrough();
    let mockSpec = spec1JSON['results'][0];

    component.displaySpecies(mockSpec);

    expect(spy).toHaveBeenCalled();
    expect(dataService.getData('Hutt')).toEqual(mockSpec);
  });

  it('[#loadData] should return species', fakeAsync(() => {
    let spy = spyOn(swapiService, 'genericFetch').and.returnValue(of(spec2JSON));
    component.nextUrl = "https://fake.species.url";
    component.species = spec1JSON.results;
    component.loadData(null);

    tick();

    expect(component.species).toBeTruthy();
    expect(component.species).toEqual(res);
    expect(spy).toHaveBeenCalled();
  }));

  it('[#loadMoreData] should return (next) set of species', fakeAsync(() => {
    let spy = spyOn(swapiService, 'genericFetch').and.returnValue(of(spec2JSON));
    component.nextUrl = "https://fake.species.url";
    component.species = spec1JSON.results;
    component.loadMoreSearch(null);

    tick();

    expect(component.species).toBeTruthy();
    expect(component.species).toEqual(res);
    expect(spy).toHaveBeenCalled();
  }));

  it('[#getSpecies] should return a s et of Species objects', fakeAsync(() => {
    spyOn(swapiService, 'getSpecies').and.returnValue(of(spec1JSON));
    spyOn(swapiService, 'genericFetch').and.returnValue(of(spec2JSON));
    expect(component.nextUrl).toBeUndefined();
    expect(component.species).toBeUndefined();
    expect(component.count).toBeUndefined();

    component.getSpecies();

    tick();

    expect(component.species).toEqual(res);
    expect(swapiService.getSpecies).toHaveBeenCalled();
    expect(swapiService.genericFetch).toHaveBeenCalled();
  }));  
});
