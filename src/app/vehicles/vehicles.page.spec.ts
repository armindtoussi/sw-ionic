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
import { VehiclesPage } from './vehicles.page';
//Services
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';
//Models
import { Vehicle } from '../models/vehicles.model';
//Rxjs
import { of } from 'rxjs';
//MockData
const vehicles1JSON = require('../testing/data/vehicles.json');
const vehicles2JSON = require('../testing/data/vehicles2.json');


describe('VehiclesPage', () => {
  let component: VehiclesPage;
  let fixture: ComponentFixture<VehiclesPage>;
  let swapiService: SwapiService;
  let dataService: DataService;
  let res = vehicles1JSON.results;

  res = res.concat(vehicles2JSON.results).sort((a: Vehicle, b: Vehicle) => {
    return (a.name).localeCompare(b.name);
  });

  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclesPage ],
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
  }));

  beforeEach(
    inject([SwapiService, DataService],
            (swService: SwapiService, dServe: DataService) => {
      swapiService = swService;
      dataService = dServe;
      fixture = TestBed.createComponent(VehiclesPage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.vehicleSub = [];
  }));

  afterEach(() => {
    component.unsubscribe();
    fixture = null;
    component = null;
  });

  it('should create vehicles page', () => {
    expect(component).toBeTruthy();
  });

  it('[#search] should call resetSearch and deliver no results', () => {
    expect(component.searchText).toBeUndefined();
    let spy = spyOn(component, 'resetSearch');

    component.search();

    expect(spy).toHaveBeenCalled();
    expect(component.vehicles).toBe(undefined);
  });

  it('[#search] should return search results and set properties', fakeAsync(() => {
    expect(component.isSearch).toBeUndefined();
    expect(component.nextUrl).toBeUndefined();

    let spy = spyOn(swapiService, 'search').and.returnValue(of(vehicles1JSON));
    component.searchText = 'dea';
    component.search();

    tick();

    expect(spy).toHaveBeenCalled();
    expect(component.isSearch).toBe(true);
    expect(component.searchText).toEqual('dea');
    expect(component.nextUrl).not.toBeUndefined();
    expect(component.vehicles).toEqual(vehicles1JSON.results);
  }));

  it('[#resetSearch] should reset isSearch and grab Vehicles', fakeAsync(() => {
    spyOn(component, 'getVehicles').and.returnValue(vehicles1JSON);
    component.isSearch = true;
    component.resetSearch();

    tick();

    expect(component.isSearch).toBe(false);
    expect(component.isSearch).toBeFalsy();
    expect(component.vehicles).not.toBeNull();
  }));

  it('[#displayVehicle] should set data in service, and navigate', () => {
    let spy = spyOn(dataService, 'setData').and.callThrough();
    let mockVehicle = vehicles1JSON['results'][0];

    component.displayVehicle(mockVehicle);

    expect(spy).toHaveBeenCalled();
    expect(dataService.getData("Sand Crawler")).toEqual(mockVehicle);
  });

  it('[#loadData] should return vehicle', fakeAsync(() => {
    let spy = spyOn(swapiService, 'genericFetch').and.returnValue(of(vehicles2JSON));
    component.nextUrl = "https://fake.starships.url";
    component.vehicles = vehicles1JSON.results;
    component.loadData(null);

    tick();

    expect(component.vehicles).toBeTruthy();
    expect(component.vehicles).toEqual(res);
    expect(spy).toHaveBeenCalled(); 
  }));

  it('[#loadMoreSearch] should return (next) set of vehicles', fakeAsync(() => {
    let spy = spyOn(swapiService, 'genericFetch').and.returnValue(of(vehicles2JSON));
    component.nextUrl = "https://fake.starships.url";
    component.vehicles = vehicles1JSON.results;
    component.loadMoreSearch(null);

    tick();

    expect(component.vehicles).toBeTruthy();
    expect(component.vehicles).toEqual(res);
    expect(spy).toHaveBeenCalled(); 
  }));

  it('[#getVehicles] should return a set of Vehicle objects', fakeAsync(() => {
    spyOn(swapiService, 'getVehicles').and.returnValue(of(vehicles1JSON));
    spyOn(swapiService, 'genericFetch').and.returnValue(of(vehicles2JSON));
    expect(component.nextUrl).toBeUndefined();
    expect(component.vehicles).toBeUndefined();
    expect(component.count).toBeUndefined();

    component.getVehicles();

    tick();

    expect(component.vehicles).toEqual(res);
    expect(swapiService.getVehicles).toHaveBeenCalled();
    expect(swapiService.genericFetch).toHaveBeenCalled();
  }));
});
