import { TestBed } from '@angular/core/testing';

import { DataResolverService } from './data-resolver.service';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('DataResolverService', () => {
  let route: ActivatedRouteSnapshot;
  let dataServiceSpy: { getData: jasmine.Spy };
  let dataResolver: DataResolverService;

  beforeEach(() => {
    route = new ActivatedRouteSnapshot();
    dataServiceSpy = jasmine.createSpyObj('DataService', ['getData']);
    dataResolver = new DataResolverService(<any>dataServiceSpy);
  });

  it('[#constructor] should be injected and service created', () => {
    expect(dataResolver).toBeTruthy();
  });

  it('[#resolve] should check paramMap for id and resolve data',  () => {
    let mockData = { "test": "data" };
    route.queryParams = { id: 5 };

    dataServiceSpy.getData.and.returnValue(mockData);

    const data = dataResolver.resolve(route);

    expect(data).toEqual(mockData);
    expect(dataServiceSpy.getData.calls.count()).toBe(1);
  });
});
