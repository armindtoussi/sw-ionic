import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { VehiclesPageComponent } from './vehicles-page.component';
import { ToastService } from 'src/app/services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CacheService } from 'src/app/services/cache.service';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../vehicles.module';

//MockData
import charsJSON   from '../../testing/data/characters.json';
import filmsJSON   from '../../testing/data/movies.json';
import vehicleJSON from '../../testing/data/vehicles.json';
import { VehiclesPage } from '../vehicles.page';
import { of } from 'rxjs';


//Mock Class
class ToastServiceMock {

  constructor() { }

  presentToast(str: string): Promise<any> {
    return Promise.resolve(str);
  }
}

describe('VehiclesPageComponent', () => {
  let component: VehiclesPageComponent;
  let fixture: ComponentFixture<VehiclesPageComponent>;
  let toastService: ToastService;

  let router: Router;

  const cacheSpyObj = jasmine.createSpyObj('CacheService', ['fetch', 'search', 'fetchSingleEntry']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VehiclesPage, VehiclesPageComponent ],
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

    fixture = TestBed.createComponent(VehiclesPageComponent);
    component = fixture.componentInstance;

    spyOn(component, 'handleData').and.returnValue(undefined);

    fixture.detectChanges();

    router.initialNavigation();
    component.vehicleSubs = [];
    component.data = vehicleJSON.results[0];
  });

  afterEach(() => { 
    component.unsubscribe();
    component.data = null;
    router = null;
    toastService = null;
    fixture = null;
    component = null;
  });

  it('should create VehiclePage component', () => {
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
    let segment = "vehicle";
    let spy = spyOn(router, 'navigateByUrl');

    component.navToElementPage(id, segment);

    expect(spy).toHaveBeenCalled();
  });

  it('[#navToElementPage] should replaces slashes and navigate to segment', () => {
    let id = "asd//5"; 
    let segment = "vehicle";
    let spy = spyOn(router, 'navigateByUrl'); 

    component.navToElementPage(id, segment);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('/vehicle/asd__5');
  });

  it('[#navToElementPage] should access the else statement and call present toast', () => {
    let id = undefined; 
    let segment = "/vehicle";
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

  it('[#fetchPilots] should get pilots', fakeAsync(() => {
    cacheSpyObj.fetch.and.returnValue(of(charsJSON.results));
    component.data.pilots = ["pilot.url.com"];
    component.fetchPilots();

    tick();

    expect(component.pilots).toEqual(charsJSON.results);
  }));

  it('[#fetchPilots] should return early', () => {
    component.data.pilots = [];
    
    component.fetchPilots();

    expect(component.pilots).toBeUndefined();
    expect(component.data.pilots.length).toBe(0);
  });

  it('[#getVehicle] should get vehicle and fetch extra data', fakeAsync(() => {
    let pathSpy = spyOn(component, 'parsePath').and.returnValue("AT-AT");
    cacheSpyObj.search.and.returnValue(of(vehicleJSON));
    spyOn(component, 'getExtraData').and.returnValue(undefined);

    component.getVehicle();

    tick();
    
    expect(component.data).toEqual(vehicleJSON.results[0]);
    expect(pathSpy).toHaveBeenCalled();
    expect(component.getExtraData).toHaveBeenCalled();
  }));

  it('[#getVehicle] should try and fail to get vehicle and call presentToast', fakeAsync(() => {
    let pathSpy = spyOn(component, 'parsePath').and.returnValue("AT-AT");
    let tSpy = spyOn(toastService, 'presentToast').and.callThrough();
    cacheSpyObj.search.and.returnValue(of(undefined));
    component.data = undefined;

    component.getVehicle();
    
    tick();

    expect(component.data).toBeFalsy();
    expect(component.data).not.toEqual(vehicleJSON.results[0]);
    expect(toastService.presentToast).toHaveBeenCalled();
    expect(tSpy).toHaveBeenCalled();
    expect(pathSpy).toHaveBeenCalled();
  }));

  // Todo - revisit this, it's not really working out.
  it('[#handleData] should else and getCharacter', fakeAsync(() => {
    
    component.handleData();

    tick();

    expect(component.handleData).toHaveBeenCalled();
  }));

  it('[#getExtraData] calls the two fetch functions', () => {
    let spy1 = spyOn(component, 'fetchFilms');
    let spy2 = spyOn(component, 'fetchPilots');

    component.getExtraData();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  //Todo - revisit parsepath because i haven't been able to test it correctly.
});
