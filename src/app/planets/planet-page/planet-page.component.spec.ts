//Ng
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//Ng Testing
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
//Services
import { ToastService } from 'src/app/services/toast.service';
import { CacheService } from 'src/app/services/cache.service';
//Pages
import { PlanetPageComponent } from './planet-page.component';
import { PlanetsPage } from '../planets.page';
//Routes
import { routes } from '../planets.module';
//MockData
import charsJSON   from '../../testing/data/characters.json';
import filmsJSON   from '../../testing/data/movies.json';
import specJSON    from '../../testing/data/species.json';
import vehicleJSON from '../../testing/data/vehicles.json';
import shipsJSON   from '../../testing/data/ships.json';
import planetsJSON from '../../testing/data/planets.json';
import { of } from 'rxjs';


//Mock Class
class ToastServiceMock {

  constructor() { }

  presentToast(str: string): Promise<any> {
    return Promise.resolve(str);
  }
}

describe('PlanetPageComponent', () => {
  let component: PlanetPageComponent;
  let fixture: ComponentFixture<PlanetPageComponent>;
  let toastService: ToastService;

  let router: Router;

  const cacheSpyObj = jasmine.createSpyObj('CacheService', ['fetch','search', 'fetchSingleEntry']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanetsPage, PlanetPageComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: ToastService, useClass: ToastServiceMock },
        { provide: CacheService, useValue: cacheSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              data: { }
            }
          }
        }
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    toastService = TestBed.get(ToastService);
    
    fixture = TestBed.createComponent(PlanetPageComponent);
    component = fixture.componentInstance;

    spyOn(component, 'handleData').and.returnValue(undefined);

    fixture.detectChanges();

    router.initialNavigation();
    component.planetSubs = [];
    component.data = planetsJSON.results[0];
  });

  afterEach(() => {
    component.unsubscribe();
    component.data = null;
    router = null;
    toastService = null;
    fixture = null;
    component = null;
  });

  it('[#isNumber] should return true for number', () => {
    let num = "5";
    let result = component.isNumber(num);

    expect(result).toBe(true);
    expect(result).toBeTruthy();
  });

  it('[#isNumber] should return false for number', () => {
    let num = "dod";
    let result = component.isNumber(num);

    expect(result).toBe(false);
    expect(result).toBeFalsy();
  });

  it('[#navToElementPage] should navigate to segment', () => {
    let id = "alderaan"; 
    let segment = "planet";
    let spy = spyOn(router, 'navigateByUrl');

    component.navToElementPage(id, segment);

    expect(spy).toHaveBeenCalled();
  });

  it('[#navToElementPage] should access the else statement and call present toast', () => {
    let id = undefined; 
    let segment = "/planet";
    let spy  = spyOn(router, 'navigateByUrl'); 
    let tSpy = spyOn(toastService, 'presentToast').and.callThrough();

    component.navToElementPage(id, segment);

    expect(spy).not.toHaveBeenCalled();
    expect(tSpy.calls.count()).toBe(1);
  });

  it('[#fetchResidents] should get films', fakeAsync(() => {
    cacheSpyObj.fetch.and.returnValue(of(charsJSON.results));

    component.fetchResidents();

    tick();

    expect(component.residents).toEqual(charsJSON.results);
  }));

  it('[#fetchResidents] should return early', () => {
    component.data.residents = [];
    
    component.fetchResidents();

    expect(component.residents).toBeUndefined();
    expect(component.data.residents.length).toBe(0);
  });

  it('[#fetchFilms] should get films', fakeAsync(() => {
    cacheSpyObj.fetch.and.returnValue(of(filmsJSON.results));

    component.fetchFilms();

    tick();

    expect(component.films).toEqual(filmsJSON.results);
  }));

  it('[#fetchFilms] should return early', () => {
    component.data.films = [];
    
    component.fetchFilms();

    expect(component.films).toBeUndefined();
    expect(component.data.films.length).toBe(0);
  });  

  it('[#getPlanet] should get planet and fetch extra data', fakeAsync(() => {
    let pathSpy = spyOn(component, 'parsePath').and.returnValue('alderaan');
    cacheSpyObj.search.and.returnValue(of(planetsJSON));
    spyOn(component, 'getExtraData').and.returnValue(undefined);

    component.getPlanet();

    tick();

    expect(component.data).toEqual(planetsJSON.results[0]);
    expect(pathSpy).toHaveBeenCalled();
    expect(component.getExtraData).toHaveBeenCalled();
  }));

  it('[#getPlanet] should try and fail to get planet and call presentToast', fakeAsync(() => {
    let pathSpy = spyOn(component, 'parsePath').and.returnValue("alderaan");
    let tSpy = spyOn(toastService, 'presentToast').and.callThrough();
    cacheSpyObj.search.and.returnValue(of(undefined));
    component.data = undefined;

    component.getPlanet();

    tick();

    expect(component.data).toBeFalsy();
    expect(component.data).not.toEqual(planetsJSON.results[0]);
    expect(toastService.presentToast).toHaveBeenCalled();
    expect(tSpy).toHaveBeenCalled();
    expect(pathSpy).toHaveBeenCalled();
  }));

  it('[#handleData] should else and getPlanetf', fakeAsync(() => {
    component.handleData();

    tick();

    expect(component.handleData).toHaveBeenCalled();
  }));

  it('[#getExtraData] calls the four fetch functions', () => {
    let spy1 = spyOn(component, 'fetchFilms');
    let spy2 = spyOn(component, 'fetchResidents');

    component.getExtraData();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  // todo - need to do a parsePath test, however i don't know how to do it properly.
}); 
