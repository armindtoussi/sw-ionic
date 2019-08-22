//Ng
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//Testing
import { async, ComponentFixture, 
         TestBed, inject, 
         fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
//Pages
import { StarshipsPage } from './starships.page';
//Services
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';
//Models
import { Starship } from '../models/starships.model';
//Rxjs
import { of } from 'rxjs';
//MockData
const ships1JSON = require('../testing/data/ships.json');
const ships2JSON = require('../testing/data/ships2.json');


describe('StarshipsPage', () => {
  let component: StarshipsPage;
  let fixture: ComponentFixture<StarshipsPage>;
  let swapiService: SwapiService;
  let dataService: DataService;
  let res = ships1JSON.results;

  res = res.concat(ships2JSON.results).sort((a: Starship, b: Starship) => {
    return (a.name).localeCompare(b.name);
  });

  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarshipsPage ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        SwapiService,
        DataService,
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              data: {},
            }
          }
        }
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ]
    }).compileComponents();
  }));

  beforeEach(
    inject([SwapiService, DataService],
           (swService: SwapiService, dServe: DataService) => {
      swapiService = swService;
      dataService = dServe;
      fixture = TestBed.createComponent(StarshipsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.shipSub = []
  }));

  afterEach(() => {
    component.unsubscribe();
    fixture = null;
    component = null;
  });

  it('should create the Starship page', () => {
    expect(component).toBeTruthy();
  });

  it('[#search] should call resetSearch and deliver no results', () => {
    expect(component.searchText).toBeUndefined();
    let spy = spyOn(component, 'resetSearch');

    component.search();

    expect(spy).toHaveBeenCalled();
    expect(component.ships).toBe(undefined);
  });

  it('[#search] should return search results and set properties', fakeAsync(() => {
    expect(component.isSearch).toBeUndefined();
    expect(component.nextUrl).toBeUndefined();

    let spy = spyOn(swapiService, 'search').and.returnValue(of(ships1JSON));
    component.searchText = 'dea';
    component.search();

    tick();

    expect(spy).toHaveBeenCalled();
    expect(component.isSearch).toBe(true);
    expect(component.searchText).toEqual('dea');
    expect(component.nextUrl).not.toBeUndefined();
    expect(component.ships).toEqual(ships1JSON.results);
  }));

  it('[#resetSearch] should reset isSearch and grab Starships', fakeAsync(() => {
    spyOn(component, 'getShips').and.returnValue(ships1JSON);
    component.isSearch = true;
    component.resetSearch();

    tick();

    expect(component.isSearch).toBe(false);
    expect(component.isSearch).toBeFalsy();
    expect(component.ships).not.toBeNull();
  }));

  it('[#displayShip] should set data in service, and navigate', () => {
    let spy = spyOn(dataService, 'setData').and.callThrough();
    let mockShip = ships1JSON['results'][0];

    component.displayShip(mockShip);

    expect(spy).toHaveBeenCalled();
    expect(dataService.getData("Executor")).toEqual(mockShip);
  });

  it('[#loadData] should return starships', fakeAsync(() => {
    let spy = spyOn(swapiService, 'genericFetch').and.returnValue(of(ships2JSON));
    component.nextUrl = "https://fake.starships.url";
    component.ships = ships1JSON.results;
    component.loadData(null);

    tick();

    expect(component.ships).toBeTruthy();
    expect(component.ships).toEqual(res);
    expect(spy).toHaveBeenCalled(); 
  }));

  it('[#loadMoreSearch] should return (next) set of starships', fakeAsync(() => {
    let spy = spyOn(swapiService, 'genericFetch').and.returnValue(of(ships2JSON));
    component.nextUrl = "https://fake.starships.url";
    component.ships = ships1JSON.results;
    component.loadMoreSearch(null);

    tick();

    expect(component.ships).toBeTruthy();
    expect(component.ships).toEqual(res);
    expect(spy).toHaveBeenCalled(); 
  }));

  it('[#getShips] should return a set of Starship objects', fakeAsync(() => {
    spyOn(swapiService, 'getStarships').and.returnValue(of(ships1JSON));
    spyOn(swapiService, 'genericFetch').and.returnValue(of(ships2JSON));
    expect(component.nextUrl).toBeUndefined();
    expect(component.ships).toBeUndefined();
    expect(component.count).toBeUndefined();

    component.getShips();

    tick();

    expect(component.ships).toEqual(res);
    expect(swapiService.getStarships).toHaveBeenCalled();
    expect(swapiService.genericFetch).toHaveBeenCalled();
  }));
});
