import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanetsPage } from './planets.page';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';



describe('PlanetsPage', () => {
  let component: PlanetsPage;
  let fixture: ComponentFixture<PlanetsPage>;
  let httpClientSpy: { get: jasmine.Spy };
  
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      declarations: [ PlanetsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));


  
  xit('should create Planets page', async () => {
    // fixture = TestBed.createComponent(PlanetsPage);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});




