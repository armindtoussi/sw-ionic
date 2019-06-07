import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarshipsPage } from './starships.page';

describe('StarshipsPage', () => {
  let component: StarshipsPage;
  let fixture: ComponentFixture<StarshipsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarshipsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarshipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
