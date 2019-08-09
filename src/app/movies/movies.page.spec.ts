import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesPage } from './movies.page';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { StorageService } from '../services/storage.service';
import { of } from 'rxjs';
import { Film } from '../models/films.model';

var moviesJSON = require('../testing/data/movies.json');

describe('MoviesPage', () => {
  let component: MoviesPage;
  let fixture: ComponentFixture<MoviesPage>;
  let storageServiceStub: Partial<StorageService>;

  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  
  beforeEach(async(() => {
    storageServiceStub = {
      getMovies: moviesJSON,
    }

    TestBed.configureTestingModule({
      declarations: [ MoviesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: StorageService, useValue: storageServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              data: {},
            }
          }
        },
        HttpClient,
        HttpHandler,
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
      ]
    })
    .compileComponents();

    // storageService = TestBed.get(StorageService);
    // spyOn(storageService, 'getMovies').and.returnValue(of(moviesJSON));
  }));

  xit('should create Movies page', async () => {
    fixture = TestBed.createComponent(MoviesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});

