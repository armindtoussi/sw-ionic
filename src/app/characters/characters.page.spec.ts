//NG
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//Ng testing
import { async, ComponentFixture, 
         TestBed, inject, 
         fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
//Pages
import { CharactersPage } from './characters.page';
//Services
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';
//RXJS
import { of } from 'rxjs';
//Models
import { Character } from '../models/character.model';
//MockData
const charsJSON  = require('../testing/data/characters.json');
const chars2JSON = require('../testing/data/characters2.json');


describe('CharactersPage', () => {
  let component: CharactersPage;
  let fixture: ComponentFixture<CharactersPage>;
  let swapiService: SwapiService;
  let dataService: DataService;
  let res = charsJSON.results;
  
  res = res.concat(chars2JSON.results).sort((a: Character, b: Character) => {
    return (a.name).localeCompare(b.name);
  });

  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharactersPage ],
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
        },
      ],
      imports: [ 
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ],
    }).compileComponents();
  }));

  beforeEach(
    inject([SwapiService, DataService],
           (swService: SwapiService, dServe: DataService) => {
      swapiService = swService;
      dataService = dServe;
      fixture = TestBed.createComponent(CharactersPage);
      component = fixture.componentInstance;

      component.characterSub = [];
  }));

  afterEach(() => {
    component.unsubscribe();
    fixture = null;
    component = null;
  });

  it('should create the Character page', async(() => {
    fixture.detectChanges();
    expect(component).toBeTruthy();

  }));

  it('[#getCharacters] should return a set of Character objects', fakeAsync(() => {
    spyOn(swapiService, 'getCharacters').and.returnValue(of(charsJSON));
    spyOn(swapiService, 'genericFetch').and.returnValue(of(chars2JSON));
    expect(component.nextUrl).toBeUndefined();
    expect(component.characters).toBeUndefined();
    expect(component.count).toBeUndefined();

    component.getCharacters();

    tick();
    
    expect(component.characters).toEqual(res);
    expect(swapiService.getCharacters).toHaveBeenCalled();
    expect(swapiService.genericFetch).toHaveBeenCalled();
  }));

  it('[#resetSearch] should reset isSearch and grab characters', fakeAsync(() => {
    spyOn(component, 'getCharacters').and.returnValue(charsJSON);
    component.isSearch = true;
    component.resetSearch();

    tick();

    expect(component.isSearch).toBe(false);
    expect(component.isSearch).toBeFalsy();
    expect(component.characters).not.toBeNull();
  }));

  it('[#loadData] should return characters', fakeAsync(() => {
    //Can't seem to figure out the CustomEvent that ionic provides to test event.target.complete();
    let spy = spyOn(swapiService, 'genericFetch').and.returnValue(of(chars2JSON));
    component.nextUrl = "https://fake.characters.url";
    component.characters = charsJSON.results;
    component.loadData(null);

    tick();

    expect(component.characters).toBeTruthy();
    expect(component.characters).toEqual(res);
    expect(spy).toHaveBeenCalled();
  }));  

  it('[#loadMoreData] should return (next) set of characters', fakeAsync(() => {
    //Can't seem to figure out the CustomEvent that ionic provides to test event.target.complete();
    let spy = spyOn(swapiService, 'genericFetch').and.returnValue(of(chars2JSON));
    component.nextUrl = "https://fake.characters.url";
    component.characters = charsJSON.results;
    component.loadMoreSearch(null);

    tick();

    expect(component.characters).toBeTruthy();
    expect(component.characters).toEqual(res);
    expect(spy).toHaveBeenCalled();
  }));

  it('[#search] should return search results and set properties', fakeAsync(() => {
    expect(component.isSearch).toBeUndefined();
    expect(component.nextUrl).toBeUndefined();

    let spy = spyOn(swapiService, 'search').and.returnValue(of(charsJSON));
    component.searchText = "lu";
    component.search();

    tick();

    expect(spy).toHaveBeenCalled();
    expect(component.isSearch).toBe(true);
    expect(component.nextUrl).not.toBeUndefined();
    expect(component.characters).toEqual(charsJSON.results);
  }));

  it('[#search] should call resetSearch and deliver no results', () => {
    expect(component.searchText).toBeUndefined();
    let spy = spyOn(component, 'resetSearch');

    component.search();

    expect(spy).toHaveBeenCalled();
    expect(component.characters).toBe(undefined);
  });

  it('[#displayCharacter] should set data in service, and navigate', () => {
    let spy = spyOn(dataService, 'setData').and.callThrough();
    let mockChar = charsJSON['results'][0];

    component.displayCharacter(mockChar);

    expect(spy).toHaveBeenCalled();
    expect(dataService.getData("Beru Whitesun lars")).toEqual(mockChar);
  });  
});
