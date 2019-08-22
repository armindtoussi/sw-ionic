//Ng
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//Ng Testing
import { async, ComponentFixture, 
         TestBed, inject, 
         fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
//Pages
import { PlanetsPage } from './planets.page';
//Services
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';
//Models
import { Planet } from '../models/planets.model';
//Rxjs
import { of } from 'rxjs';
//MockData.
const planets1JSON = require('../testing/data/planets.json');
const planets2JSON = require('../testing/data/planets2.json');


describe('PlanetsPage', () => {
  let component: PlanetsPage;
  let fixture: ComponentFixture<PlanetsPage>;
  let swapiService: SwapiService;
  let dataService: DataService;

  let res = planets1JSON.results;
  res = res.concat(planets2JSON.results).sort((a: Planet, b: Planet) => {
    return (a.name).localeCompare(b.name);
  });

  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanetsPage ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        SwapiService,
        DataService,
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              params: {},
              data: {}
            }
          }
        }
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(
    inject([SwapiService, DataService], 
           (swService: SwapiService, dServe: DataService) => {
      swapiService = swService;
      dataService = dServe;  
      fixture = TestBed.createComponent(PlanetsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.planetSub = [];
  }));

  afterEach(() => {
    component.unsubscribe();
    fixture = null;
    component = null;
  });

  it('should create Planets page', async () => {
    fixture = TestBed.createComponent(PlanetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('[#isNumber] should turn true for it is a number', () => {
    let num = "45";
    let res = component.isNumber(num);

    expect(res).toBeTruthy();
  });

  it('[#isNumber] should turn false for it is a number', () => {
    let num = "qw";
    let res = component.isNumber(num);

    expect(res).toBeFalsy();
  });

  it('[#isNumber] should turn false for it is a number', () => {
    let num = undefined;
    let res = component.isNumber(num);

    expect(res).toBeFalsy();
  });

  it('[#search] should return early - invalid search text', () => {
    expect(component.searchText).toBeUndefined();
    let spy = spyOn(component, 'resetSearch');

    component.search();

    expect(spy).toHaveBeenCalled();
    expect(component.planets).toBe(undefined);
  });

  it('[#search] should return search results and set isSearch prop', fakeAsync(() => {
    expect(component.isSearch).toBeUndefined();
    expect(component.nextUrl).toBeUndefined();

    let spy = spyOn(swapiService, 'search').and.returnValue(of(planets1JSON));
    component.searchText = "al";
    component.search();

    tick();

    expect(spy).toHaveBeenCalled();
    expect(component.isSearch).toBe(true);
    expect(component.nextUrl).not.toBeUndefined();
    expect(component.planets).toEqual(planets1JSON.results);
  }));

  it('[#resetSearch] should set isSearch false and grab planets', fakeAsync(() => {
    spyOn(component, 'getPlanets').and.returnValue(planets1JSON);
    expect(component.isSearch).toBeUndefined();

    component.isSearch = true;
    component.resetSearch();

    tick();

    expect(component.isSearch).toBe(false);
    expect(component.isSearch).toBeFalsy();
    expect(component.planets).not.toBeNull();
  }));

  it('[#getPlanets] should get and return planets', fakeAsync(() => {
    spyOn(swapiService, 'getPlanets').and.returnValue(of(planets1JSON));
    spyOn(swapiService, 'genericFetch').and.returnValue(of(planets2JSON));
    expect(component.nextUrl).toBeUndefined();
    expect(component.planets).toBeUndefined();
    expect(component.count).toBeUndefined();

    component.getPlanets();

    tick();

    expect(component.planets).toEqual(res);
    expect(swapiService.getPlanets).toHaveBeenCalled();
    expect(swapiService.genericFetch).toHaveBeenCalled();
  }));

  it('[#displayPlanet] should set data in service and navigate', fakeAsync(() => {
    let spy = spyOn(dataService, 'setData').and.callThrough();
    let mockPlanet = planets1JSON['results'][0];

    component.displayPlanet(mockPlanet);

    expect(spy).toHaveBeenCalled();
    expect(dataService.getData("Alderaan")).toEqual(mockPlanet);
  }));

  it('[#loadData] should return planet data', fakeAsync(() => {
    expect(component.nextUrl).toBeUndefined();
    expect(component.planets).toBeUndefined(); 

    let spy = spyOn(swapiService, 'genericFetch').and.returnValue(of(planets2JSON));
    component.nextUrl = "https://fake.plants.url";
    component.planets = planets1JSON.results;
    component.loadData(null);

    tick();

    expect(component.planets).toBeTruthy();
    expect(component.planets).toEqual(res);
    expect(spy).toHaveBeenCalled();
  }));

  it('[#loadMoreData] should return (next) set of planet data', fakeAsync(() => {
    expect(component.nextUrl).toBeUndefined();
    expect(component.planets).toBeUndefined(); 

    let spy = spyOn(swapiService, 'genericFetch').and.returnValue(of(planets2JSON));
    component.nextUrl = "https://fake.plants.url";
    component.planets = planets1JSON.results;
    component.loadMoreSearch(null);

    tick();

    expect(component.planets).toBeTruthy();
    expect(component.planets).toEqual(res);
    expect(spy).toHaveBeenCalled();
  }));
});




