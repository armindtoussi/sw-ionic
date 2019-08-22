import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetPageComponent } from './planet-page.component';

//MockData
import charsJSON   from '../../testing/data/characters.json';
import filmsJSON   from '../../testing/data/movies.json';
import specJSON    from '../../testing/data/species.json';
import vehicleJSON from '../../testing/data/vehicles.json';
import shipsJSON   from '../../testing/data/ships.json';
import planetsJSON from '../../testing/data/planets.json';

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


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanetPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
