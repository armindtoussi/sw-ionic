import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//Ionic
import { IonInfiniteScroll } from '@ionic/angular';
//RXJS
import { Subscription } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
//Services
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';
//Models
import { Vehicle } from '../models/vehicles.model';
//ENV
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
})
export class VehiclesPage implements OnInit, OnDestroy {
  /** Infinit scroll view child ref. */
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  /** Subscriptions. */
  vehicleSub: Subscription[];
  /** Vehicle fetch results. */
  vehicles: Vehicle[];
  /** Next set of ship results url. */
  nextUrl: string;
  /** Total number of results. */
  count: number;

  searchText: string;
  isSearch: boolean; 

  /**
   * ctor
   * @param _swapiFetchService sw api service
   * @param _dataService data passing service
   * @param router router
   */
  constructor(private _swapiFetchService: SwapiService,
              private _dataService: DataService,
              private router: Router) { }

  /**
   * lifecycle hook runs when component is being created. 
   * inits subs gets data.
   */
  ngOnInit(): void {
    this.vehicleSub = [];
    this.getVehicles();
  }

  /**
   * lifecycle hook runs when component is destroyed. 
   * Unsubs to subs.
   */
  ngOnDestroy(): void {
    this.unsubscribe();
  }

  search(): void {
    if(this.searchText === "" || this.searchText === undefined) {
      return this.resetSearch(); 
    }

    this.vehicleSub[2] = this._swapiFetchService.search(this.searchText, environment.swapiVehicles)
      .subscribe((results: any) => {
        this.isSearch = true;
        this.nextUrl = results['next'];
        this.vehicles = results.results.sort((a: Vehicle, b: Vehicle) => this.sortArr(a.name, b.name));
      });
  }

  resetSearch(): void {
    this.isSearch = false;
    this.getVehicles();
  }

  /**
   * Click function that navigates to vehicle details page.
   * Passes id, and data to service that gets resolved. 
   * 
   * @param vehicle the vehicle that was clicked. 
   */
  displayVehicle(vehicle: Vehicle): void {
    this._dataService.setData(this.replaceSlashses(vehicle.name), vehicle);
    this.router.navigateByUrl(`/vehicle/${this.replaceSlashses(vehicle.name)}`);
  }

  /**
   * Infinite scroll hook, fetchings the next set of results for display.
   * @param event the screen scroll event that triggers this.
   */
  loadData(event: any): void {
    this.vehicleSub[1] = this._swapiFetchService.genericFetch(this.nextUrl)
      .subscribe(
        (results: object) => {
          this.vehicles = this.vehicles.concat(results['results'])
                                       .sort((a: Vehicle, b: Vehicle) => this.sortArr(a.name, b.name));
          this.nextUrl = results['next'];

          if(event !== null)
            event.target.complete();

          if(this.vehicles.length === this.count) {
            event.target.disabled = true;
          }
        }
      );
  }

  loadMoreSearch(event: any): void {
    this.vehicleSub[3] = this._swapiFetchService.genericFetch(this.nextUrl) 
      .subscribe((results: object) => {
        this.vehicles = this.vehicles.concat(results['results'])
                                     .sort((a: Vehicle, b: Vehicle) => this.sortArr(a.name, b.name));
        this.nextUrl = results['next'];
        
        if(event !== null)
          event.target.complete();
      });
  }

  /**
   * replace slashes in vehicle ids for url segment.
   * @param str string to replace slash.
   */
  private replaceSlashses(str: string): string {
    return str.replace(/\//g, "_");
  }

  /**
   * Fetches the initial 20 results for display
   */
  public getVehicles(): void {
    this.vehicleSub[0] = this._swapiFetchService.getVehicles()
      .pipe(
        map(res => {
          this.nextUrl = res['next'];
          this.vehicles = res['results'];
        }),
        map(res => this._swapiFetchService.genericFetch(this.nextUrl)),
        flatMap(res => res),
      ).subscribe(
        (results: object) => {
          this.count = results['count'];
          this.nextUrl = results['next'];
          this.vehicles = this.vehicles.concat(results['results'])
                                       .sort((a: Vehicle, b: Vehicle) => this.sortArr(a.name, b.name));
        }
      );
  }

  /**
   * String sort function. 
   * @param a string to sort 
   * @param b string to sort
   */
  private sortArr(a: string, b: string): number {
    return (a).localeCompare(b);
  }

  /**
   * Unsubscribes from subs.
   */
  public unsubscribe(): void {
    for(let i = 0; i < this.vehicleSub.length; i++) {
      if(this.vehicleSub[i] !== undefined) {
        this.vehicleSub[i].unsubscribe();
      }
    }
  }
}
