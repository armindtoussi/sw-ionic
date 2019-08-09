import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
//Pages
import { CharactersPage } from './characters.page';


describe('CharactersPage', () => {
  let component: CharactersPage;
  let fixture: ComponentFixture<CharactersPage>;

  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharactersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
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
        HttpClient,
        HttpHandler,
      ],
      imports: [ 
        RouterTestingModule.withRoutes([]),
      ],
    })
    .compileComponents();
  }));

  xit('should create the Character page', async () => {
    fixture = TestBed.createComponent(CharactersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
