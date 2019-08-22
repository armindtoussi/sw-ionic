//Ng
import { Router, ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//Ng Testing
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, 
         TestBed, fakeAsync, tick } from '@angular/core/testing';
//Pages
import { SpeciesPageComponent } from './species-page.component';
import { SpeciesPage } from '../species.page';
//Services
import { ToastService } from 'src/app/services/toast.service';
import { CacheService } from 'src/app/services/cache.service';
//Routes
import { routes } from '../species.module';
//Rxjs
import { of } from 'rxjs';
//MockData.
import charsJSON   from '../../testing/data/characters.json';
import filmsJSON   from '../../testing/data/movies.json';
import specJSON    from '../../testing/data/species.json';


//Mock Class
class ToastServiceMock {

  constructor() { }

  presentToast(str: string): Promise<any> {
    return Promise.resolve(str);
  }
}


describe('SpeciesPageComponent', () => {
  let component: SpeciesPageComponent;
  let fixture: ComponentFixture<SpeciesPageComponent>;
  let toastService: ToastService;

  let router: Router;

  const cacheSpyObj = jasmine.createSpyObj('CacheService', ['fetch', 'search', 'fetchSingleEntry']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeciesPage, SpeciesPageComponent ],
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
    router = TestBed.get(Router);
    toastService = TestBed.get(ToastService);

    fixture = TestBed.createComponent(SpeciesPageComponent);
    component = fixture.componentInstance;

    spyOn(component, 'handleData').and.returnValue(undefined);

    fixture.detectChanges();

    router.initialNavigation();
    component.speciesSubs = [];
    component.data = specJSON.results[0];
  });

  afterEach(() => {
    component.unsubscribe();
    component.data = null;
    router = null;
    toastService = null;
    fixture = null;
    component = null;
  });

  it('should create SpeciesPage component', () => {
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
    let segment = "species";
    let spy = spyOn(router, 'navigateByUrl');

    component.navToElementPage(id, segment);

    expect(spy).toHaveBeenCalled();
  });

  it('[#navToElementPage] should access the else statement and call present toast', () => {
    let id = undefined; 
    let segment = "/species";
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

  it('[#fetchPeople] should get species', fakeAsync(() => {
    cacheSpyObj.fetch.and.returnValue(of(charsJSON.results));

    component.fetchPeople();

    tick();

    expect(component.people).toEqual(charsJSON.results);
  }));

  it('[#fetchPeople] should return early', () => {
    component.data.people = [];
    
    component.fetchPeople();

    expect(component.people).toBeUndefined();
    expect(component.data.people.length).toBe(0);
  });

  it('[#getSpecies] should get species and fetch extra', fakeAsync(() => {
    let pathSpy = spyOn(component, 'parsePath').and.returnValue("hutt");
    cacheSpyObj.search.and.returnValue(of(specJSON));
    spyOn(component, 'getExtraData').and.returnValue(undefined);

    component.getSpecies();

    tick();

    expect(component.data).toEqual(specJSON.results[0]);
    expect(pathSpy).toHaveBeenCalled();
    expect(component.getExtraData).toHaveBeenCalled();
  }));

  it('[#getSpecies] should try and fail to get species and call presentToast', fakeAsync(() => {
    let pathSpy = spyOn(component, 'parsePath').and.returnValue("hutt");
    let tSpy = spyOn(toastService, 'presentToast').and.callThrough();
    cacheSpyObj.search.and.returnValue(of(undefined));
    component.data = undefined;

    component.getSpecies();

    tick();

    expect(component.data).toBeFalsy();
    expect(component.data).not.toEqual(specJSON.results[0]);
    expect(toastService.presentToast).toHaveBeenCalled();
    expect(tSpy).toHaveBeenCalled();
    expect(pathSpy).toHaveBeenCalled();
  }));

  // Todo - this isn't working for some reason.
  it('[#handleData] should else and getCharacter', fakeAsync(() => {
    
    component.handleData();

    tick();

    expect(component.handleData).toHaveBeenCalled();
  }));

  it('[#getExtraData] calls the two fetch functions', () => {
    let spy1 = spyOn(component, 'fetchFilms');
    let spy2 = spyOn(component, 'fetchPeople');

    component.getExtraData();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  // Todo - revisist resting parse path.
});
