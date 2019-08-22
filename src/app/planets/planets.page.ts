import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//Services 
import { SwapiService } from '../services/swapi.service';
import { DataService }  from '../services/data.service';
import { CacheService } from '../services/cache.service';
//Ionic
import { IonInfiniteScroll } from '@ionic/angular';
//RXJS
import { Subscription } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
//Models
import { Planet } from '../models/planets.model';
//ENV
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-planets',
  templateUrl: './planets.page.html',
  styleUrls: ['./planets.page.scss'],
})
export class PlanetsPage implements OnInit, OnDestroy {
  /** Infinite scroll view child reference. */
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  /** Planets subscription. */
  planetSub: Subscription[];

  /** Planets array. */
  planets: Planet[];
  /** url for next set of planets. */
  nextUrl: string;
  /** total number of planet entries. */
  count: number;

  searchText: string;
  isSearch: boolean;

  /**
   * ctor. 
   * 
   * @param _swapiFetchService swapi fetch service. 
   * @param _dataService data service for passing data. 
   * @param router routing. 
   */
  constructor(private _swapiFetchService: SwapiService,
              private _dataService: DataService,
              private router: Router) { }
   
  /**
   * OnInit lifecycle hook.
   * Inits the planet list. 
   */            
  ngOnInit(): void {
    this.planetSub = [];
    this.getPlanets();
  }

  /**
   * OnDestroy lifecycle hook. 
   * Unsubscribes to observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe();
  }

  /**
   * Determines if it's a number.
   * @param arg value to check if it's a number.
   */
  isNumber(arg: any): boolean  {
    return !isNaN(parseFloat(arg)) && !isNaN(arg - 0);
  }

  search(): void {
    if(this.searchText === "" || this.searchText === undefined) {
      return this.resetSearch();
    }

    this.planetSub[2] = this._swapiFetchService.search(this.searchText, environment.swapiPlanets)
      .subscribe((results: any) => {
        this.isSearch = true;
        this.nextUrl = results['next'];
        this.planets = results.results.sort((a: Planet, b: Planet) => this.sortArr(a.name, b.name));
      });
  }

  resetSearch(): void {
    this.isSearch = false;
    this.getPlanets();
  }

  /**
   * Navigates to planet detail display page. 
   * @param planet planet to display. 
   */
  displayPlanet(planet: Planet): void {
    this._dataService.setData(planet.name, planet);
    this.router.navigateByUrl(`/planet/${planet.name}`);
  }

  /**
   * Loads data on infinite scroll event. 
   * 
   * @param event the scroll event.
   */
  loadData(event: any): void {
    this.planetSub[1] = this._swapiFetchService.genericFetch(this.nextUrl)
      .subscribe(
        (results: object) => {
          this.planets = this.planets.concat(results['results'])
                                     .sort((a: Planet, b: Planet) => this.sortArr(a.name, b.name));
          this.nextUrl = results['next'];

          if(event !== null)
            event.target.complete();

          if(this.planets.length === this.count) {
            event.target.disabled = true;
          }
      });
  }

  loadMoreSearch(event: any): void {
    this.planetSub[3] = this._swapiFetchService.genericFetch(this.nextUrl)
      .subscribe((results: object) => {
        this.planets = this.planets.concat(results['results'])
                                   .sort((a: Planet, b: Planet) => this.sortArr(a.name, b.name));
        this.nextUrl = results['next'];
        
        if(event !== null) 
          event.target.complete();
      });
  }

  /**
   * Gets first 20 planets through swapi service. 
   */
  public getPlanets(): void {
    this.planetSub[0] = this._swapiFetchService.getPlanets()
      .pipe(
        map(res => {
          this.nextUrl = res['next'];
          this.planets = res['results'];
        }), 
        map(res => this._swapiFetchService.genericFetch(this.nextUrl)),
        flatMap(res => res),        
      ).subscribe(
        (results: object) => 
        {
          this.count   = results['count'];
          this.nextUrl = results['next'];
          this.planets = this.planets.concat(results['results'])
                                     .sort((a: Planet, b: Planet) => this.sortArr(a.name, b.name));
        }
      );
  }

  /**
   * Unsubs to subs. 
   */
  public unsubscribe(): void {
    for(let i = 0; i < this.planetSub.length; i++) {
      if(this.planetSub[i] !== undefined) {
        this.planetSub[i].unsubscribe();
      }
    }
  }

  /**
   * String sort function. 
   * @param a string to sort 
   * @param b string to sort
   */
  public sortArr(a: string, b: string): number {
    return (a).localeCompare(b);
  }
}
