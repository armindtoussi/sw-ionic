import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store data & fetch data', () => {
    const obj = { data: 'this is some data'};

    service.setData('1', obj);
    expect(service.getData('1')).toEqual(obj);
  });
});
