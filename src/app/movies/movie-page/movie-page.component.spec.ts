//Ng
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//Ionic
import { ModalController } from '@ionic/angular';
//Ng Testing
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
//Pages/components
import { MoviePageComponent } from './movie-page.component';
import { MoviesPage } from '../movies.page';

//Services
import { ToastService } from 'src/app/services/toast.service';
import { CacheService } from 'src/app/services/cache.service';
//Modules
import { routes } from '../movies.module'; 
import { RouterTestingModule } from '@angular/router/testing';
//Rxjs
import { of } from 'rxjs';
//MockData
import charsJSON   from '../../testing/data/characters.json';
import filmsJSON   from '../../testing/data/movies.json';
import specJSON    from '../../testing/data/species.json';
import vehicleJSON from '../../testing/data/vehicles.json';
import shipsJSON   from '../../testing/data/ships.json';
import planetsJSON from '../../testing/data/planets.json';

//Mock Classes
class ToastServiceMock {

  constructor() { }

  presentToast(str: string): Promise<any> {
    return Promise.resolve(str);
  }
}

class ModalControllerMock {
  constructor() {}

  create(obj: object): Modal {
    return new Modal();
  }
}

class Modal {
  constructor() { }

  present() {
    return "Hello";
  }
}

describe('MoviePageComponent', () => {
  let component: MoviePageComponent;
  let fixture: ComponentFixture<MoviePageComponent>;
  let toastService: ToastService;
  let modalCtrl: ModalController;
  let router: Router;

  const cacheSpyObj = jasmine.createSpyObj('CacheService', ['fetch', 'search', 'fetchSingleEntry']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoviesPage, MoviePageComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: ToastService, useClass: ToastServiceMock },
        { provide: CacheService, useValue: cacheSpyObj },
        { provide: ModalController, useClass: ModalControllerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: {},
            data: {}
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
    modalCtrl = TestBed.get(ModalController);

    fixture = TestBed.createComponent(MoviePageComponent);
    component = fixture.componentInstance;

    spyOn(component, 'handleData').and.returnValue(undefined);

    fixture.detectChanges();

    router.initialNavigation();
    component.movieSubs = [];

    component.data = filmsJSON.results[1];
  });

  afterEach(() => {
    component.unsubscribe();
    component.data = null;
    router = null;
    toastService = null;
    fixture = null;
    component = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('[#navToElementPage] should replaces slashes and navigate to segment', () => {
    let id = "asd//5"; 
    let segment = "people";
    let spy = spyOn(router, 'navigateByUrl'); 

    component.navToElementPage(id, segment);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('/people/asd__5');
  });

  it('[#navToElementPage] should access the else statement and call present toast', () => {
    //Can't access the .then on the present toast, this probably goes back to my inability to test it.
    let id = undefined; 
    let segment = "/people";
    let spy  = spyOn(router, 'navigateByUrl'); 
    let tSpy = spyOn(toastService, 'presentToast').and.callThrough();

    component.navToElementPage(id, segment);

    expect(spy).not.toHaveBeenCalled();
    expect(tSpy.calls.count()).toBe(1);
  });
  
  it('[#presentCrawlModal] should create modal and present', fakeAsync(() => {
    let spy = spyOn(modalCtrl, 'create').and.callThrough();

    component.presentCrawlModal();

    expect(spy).toHaveBeenCalled();
  }));

  it('[#fetchVehicles] should return early', () => {
    component.data.vehicles = [];

    component.fetchVehicles();

    expect(component.vehicles).toBeUndefined();
    expect(component.data.vehicles.length).toBe(0);
  });

  it('[#fetchVehicles] should get vehicles', fakeAsync(() => {
    cacheSpyObj.fetch.and.returnValue(of(vehicleJSON.results));
    component.data.vehicles = ["fake.url.com", "fake.url2.com"];
    
    component.fetchVehicles();

    tick();

    expect(cacheSpyObj.fetch).toHaveBeenCalled();
    expect(component.vehicles).toEqual(vehicleJSON.results);
  }));

  it('[#fetchStartships] should fetch and set starhips data', fakeAsync(() => {
    cacheSpyObj.fetch.and.returnValue(of(shipsJSON.results));

    component.fetchStarships();

    tick();

    expect(cacheSpyObj.fetch).toHaveBeenCalled();
    expect(component.starships).toEqual(shipsJSON.results);
  }));

  it('[#fetchStarships] should return early', () => {
    component.data.starships = [];

    component.fetchStarships();

    expect(component.starships).toBeUndefined();
    expect(component.data.starships.length).toBe(0);
  });

  it('[#fetchSpecies] should fetch and set species data', fakeAsync(() => {
    cacheSpyObj.fetch.and.returnValue(of(specJSON.results));

    component.fetchSpecies();

    tick();

    expect(cacheSpyObj.fetch).toHaveBeenCalled();
    expect(component.species).toEqual(specJSON.results);
  }));

  it('[#fetchSpecies] should return early', () => {
    component.data.species = [];

    component.fetchSpecies();

    expect(component.species).toBeUndefined();
    expect(component.data.species.length).toBe(0);
  });

  it('[#fetchPlanets] should fetch and set planets data', fakeAsync(() => {
    cacheSpyObj.fetch.and.returnValue(of(planetsJSON.results));

    component.fetchPlanets();

    tick();

    expect(cacheSpyObj.fetch).toHaveBeenCalled();
    expect(component.planets).toEqual(planetsJSON.results);
  }));

  it('[#fetchPlanets] should return early', () => {
    component.data.planets = [];

    component.fetchPlanets();

    expect(component.planets).toBeUndefined();
    expect(component.data.planets.length).toBe(0);
  });

  it('[#fetchCharacters] should fetch and set characters data', fakeAsync(() => {
    cacheSpyObj.fetch.and.returnValue(of(charsJSON.results));

    component.fetchCharacters();

    tick();

    expect(cacheSpyObj.fetch).toHaveBeenCalled();
    expect(component.characters).toEqual(charsJSON.results);
  }));

  it('[#fetchCharacters] should return early', () => {
    component.data.characters = [];

    component.fetchCharacters();

    expect(component.characters).toBeUndefined();
    expect(component.data.characters.length).toBe(0);
  });

  it('[#getMovie] should get Movie and fetch extra data', fakeAsync(() => {
    let pathSpy = spyOn(component, 'parsePath').and.returnValue("1");
    cacheSpyObj.fetchSingleEntry.and.returnValue(Promise.resolve(filmsJSON.results[0]));
    spyOn(component, 'getExtraData').and.returnValue(undefined);

    component.getMovie();

    tick();

    expect(component.data).toEqual(filmsJSON.results[0]);
    expect(pathSpy).toHaveBeenCalled();
    expect(component.getExtraData).toHaveBeenCalled();
  }));

  it('[#getMovie] should try and fail to get movie and call present toast', fakeAsync(() => {
    let pathSpy = spyOn(component, 'parsePath').and.returnValue("1");
    let tSpy = spyOn(toastService, 'presentToast').and.callThrough();
    cacheSpyObj.fetchSingleEntry.and.returnValue(Promise.resolve(undefined));
    component.data = undefined;

    component.getMovie();

    tick();

    expect(component.data).toBeFalsy();
    expect(component.data).not.toEqual(filmsJSON.results[0]);
    expect(toastService.presentToast).toHaveBeenCalled();
    expect(tSpy).toHaveBeenCalled();
    expect(pathSpy).toHaveBeenCalled();
  }));

  // TODO - come back to this test because it isn't really doing much. 
  it('[#handleData] should else and getMovie', fakeAsync(() => {
    component.handleData();

    tick();

    expect(component.handleData).toHaveBeenCalled();
  }));

  it('[#getExtraData] should call the 5 fetch functions', () => {
    let spy1 = spyOn(component, 'fetchCharacters');
    let spy2 = spyOn(component, 'fetchVehicles');
    let spy3 = spyOn(component, 'fetchStarships');
    let spy4 = spyOn(component, 'fetchSpecies');
    let spy5 = spyOn(component, 'fetchPlanets');

    component.getExtraData();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
  });

  // todo - need to do a parsePath test, however i don't know how to do it properly.
});
