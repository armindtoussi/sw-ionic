import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Services
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class DataResolverService implements Resolve<any> {

  /**
   * ctor.
   * @param _dataService service for passing data. 
   */
  constructor(private _dataService: DataService) { }

  /**
   * Resolves the data being passed. 
   * 
   * @param route the route snapshot.
   */
  resolve(route: ActivatedRouteSnapshot): object {
    let id = route.paramMap.get('id');
    return this._dataService.getData(id);
  }
}
