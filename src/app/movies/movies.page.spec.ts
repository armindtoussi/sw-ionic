import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//Testing ng
import { async, ComponentFixture, 
         TestBed, fakeAsync, 
         tick, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, 
         HttpTestingController } from '@angular/common/http/testing';
//Pages
import { MoviesPage } from './movies.page';
//RXJS
import { of } from 'rxjs';
//Services.
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';
//MockData
import moviesJSON from '../testing/data/movies.json';


describe('MoviesPage', () => {
  let component: MoviesPage;
  let fixture: ComponentFixture<MoviesPage>;
  let swapiService: SwapiService;
  let dataService : DataService;

  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoviesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
        },
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
      dataService  = dServe;
      fixture = TestBed.createComponent(MoviesPage);
      component = fixture.componentInstance;
  }));


  it('should create Movies page', async (() => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('[#getFilms] should get movies', fakeAsync(() => {
    spyOn(swapiService, 'getSWMovies').and.returnValue(of(moviesJSON));
    expect(component.movies).toBeUndefined();
    component.movieSub = [];
    component.getMovies();

    tick(); 

    fixture.detectChanges();

    expect(component.movies).toBeDefined();
    expect(component.movies).toEqual(moviesJSON.results);
  }));

  it('[#search] should search and display movies results', fakeAsync(() => {
    spyOn(swapiService, 'search').and.returnValue(of(moviesJSON));
    expect(component.movies).toBeUndefined();
    
    component.movieSub = []; 
    component.search();

    tick();

    fixture.detectChanges();

    expect(component.movies).toBeDefined();
    expect(component.movies).toEqual(moviesJSON.results);
  }));

  it('[#displayMovie] should set data in service and navigate', () => {
    spyOn(dataService, 'setData').and.callThrough();
    let mockMovie = moviesJSON['results'][0];
    
    component.displayMovie(mockMovie);

    expect(dataService.getData("1")).toEqual(mockMovie);
  });
});

