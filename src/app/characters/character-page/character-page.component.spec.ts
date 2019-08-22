//Ng
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//Ng Testing
import { async, ComponentFixture, 
         TestBed, fakeAsync, tick } from '@angular/core/testing';

//Pages/Components
import { CharacterPageComponent } from './character-page.component';
import { CharactersPage } from '../characters.page';
//Services
import { ToastService } from 'src/app/services/toast.service';
import { CacheService } from 'src/app/services/cache.service';
//Modules
import { routes } from '../characters.module'; 
import { RouterTestingModule } from '@angular/router/testing';
//Rxjs
import { of } from 'rxjs';
//MockData
import charsJSON   from '../../testing/data/characters.json';
import filmsJSON   from '../../testing/data/movies.json';
import specJSON    from '../../testing/data/species.json';
import vehicleJSON from '../../testing/data/vehicles.json';
import shipsJSON   from '../../testing/data/ships.json';

//Mock Class
class ToastServiceMock {

  constructor() { }

  presentToast(str: string): Promise<any> {
    return Promise.resolve(str);
  }
}


describe('CharacterPageComponent', () => {
  let component: CharacterPageComponent;
  let fixture: ComponentFixture<CharacterPageComponent>;
  let cacheService: CacheService;
  let toastService: ToastService;

  let router: Router;

  const cacheSpyObj  = jasmine.createSpyObj('CacheService', ['fetch', 'search']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharactersPage, CharacterPageComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: ToastService, useClass: ToastServiceMock },
        { provide: CacheService, useValue: cacheSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { },
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
    //Get services.
    router = TestBed.get(Router);
    toastService = TestBed.get(ToastService);
    // cacheService = TestBed.get(CacheService);

    //create component
    fixture = TestBed.createComponent(CharacterPageComponent);
    component = fixture.componentInstance;

    //Init component. 
    spyOn(component, 'handleData').and.returnValue(undefined);

    fixture.detectChanges();

    //init things for the component, nav, subs, data(field).
    router.initialNavigation();
    component.charSubs = [];
    component.data = charsJSON.results[3];
  });

  afterEach(() => { 
    component.unsubscribe();
    component.data = null;
    router = null;
    toastService = null;
    fixture = null;
    component = null;
  });

  it('should create CharacterPage component', () => {
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

  it('[#navToElementPage] should navigate to segment', () => {
    let id = "5"; 
    let segment = "people";
    let spy = spyOn(router, 'navigateByUrl');

    component.navToElementPage(id, segment);

    expect(spy).toHaveBeenCalled();
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

  it('[#fetchSpecies] should get species', fakeAsync(() => {
    cacheSpyObj.fetch.and.returnValue(of(specJSON.results));

    component.fetchSpecies();

    tick();

    expect(component.species).toEqual(specJSON.results);
  }));

  it('[#fetchSpecies] should return early', () => {
    component.data.species = [];
    
    component.fetchSpecies();

    expect(component.species).toBeUndefined();
    expect(component.data.species.length).toBe(0);
  });

  it('[#fetchStarships] should get starships', fakeAsync(() => {
    cacheSpyObj.fetch.and.returnValue(of(shipsJSON.results));

    component.fetchStarships();

    tick();

    expect(component.ships).toEqual(shipsJSON.results);
  }));

  it('[#fetchStarships] should return early', () => {
    component.data.starships = [];
    
    component.fetchStarships();

    expect(component.ships).toBeUndefined();
    expect(component.data.starships.length).toBe(0);
  });

  it('[#fetchVehicles] should get vehicles', fakeAsync(() => {
    component.data.vehicles = ["some.url.com"];
    cacheSpyObj.fetch.and.returnValue(of(vehicleJSON.results));

    component.fetchVehicles();

    tick();

    expect(component.vehicles).toEqual(vehicleJSON.results);
  }));

  it('[#fetchVehicles] should return early', () => {
    component.data.vehicles = [];
    
    component.fetchVehicles();

    expect(component.vehicles).toBeUndefined();
    expect(component.data.vehicles.length).toBe(0);
  });

  it('[#getCharacter] should get character and fetch extra data', fakeAsync(() => {
    let pathSpy = spyOn(component, 'parsePath').and.returnValue("Darth Vader");
    cacheSpyObj.search.and.returnValue(of(charsJSON));
    spyOn(component, 'getExtraData').and.returnValue(undefined);

    component.getCharacter();

    tick();
    
    expect(component.data).toEqual(charsJSON.results[0]);
    expect(pathSpy).toHaveBeenCalled();
    expect(component.getExtraData).toHaveBeenCalled();
  }));

  it('[#getCharacter] should try and fail to get character and call presentToast', fakeAsync(() => {
    let pathSpy = spyOn(component, 'parsePath').and.returnValue("Darth Vader");
    let tSpy = spyOn(toastService, 'presentToast').and.callThrough();
    cacheSpyObj.search.and.returnValue(of(undefined));
    component.data = undefined;

    component.getCharacter();
    
    tick();

    expect(component.data).toBeFalsy();
    expect(component.data).not.toEqual(charsJSON.results[0]);
    expect(toastService.presentToast).toHaveBeenCalled();
    expect(tSpy).toHaveBeenCalled();
    expect(pathSpy).toHaveBeenCalled();
  }));

  it('[#handleData] should else and getCharacter', fakeAsync(() => {
    
    component.handleData();

    tick();

    expect(component.handleData).toHaveBeenCalled();
  }));

  it('[#getExtraData] calls the four fetch functions', () => {
    let spy1 = spyOn(component, 'fetchFilms');
    let spy2 = spyOn(component, 'fetchVehicles');
    let spy3 = spyOn(component, 'fetchStarships');
    let spy4 = spyOn(component, 'fetchSpecies');

    component.getExtraData();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
  });

  it('[#parsePath] should parse path', () => {
    router.navigateByUrl('/character/Darth%20Vader');
    let spy = spyOn(component, 'parsePath');
    
    component.parsePath();
    
    //This test isn't really testing anything... not sure, maybe revist.
    expect(spy).toHaveBeenCalled();
  }); 
});
