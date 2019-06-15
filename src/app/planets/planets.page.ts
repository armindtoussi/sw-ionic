import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

//Services 
import { SwapiService } from '../services/swapi.service';
import { DataService }  from '../services/data.service';

//Ionic
import { IonInfiniteScroll } from '@ionic/angular';

//RXJS
import { Subscription } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

//Models
import { PlanetsModel } from '../models/planets.model';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.page.html',
  styleUrls: ['./planets.page.scss'],
})
export class PlanetsPage implements OnInit, OnDestroy {
  /** Infinite scroll view child reference. */
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  /** Planets subscription. */
  planetSub: Subscription[] = [];

  /** Planets array. */
  planets: PlanetsModel[];
  /** url for next set of planets. */
  nextUrl: string;
  /** total number of planet entries. */
  count: number;

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
    this.getPlanets();
  }

  /**
   * OnDestroy lifecycle hook. 
   * Unsubscribes to observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe();
  }

  displayPlanet(planet: PlanetsModel): void {
    console.log("cliked: ", planet);
    this._dataService.setData(planet.name, planet);
    this.router.navigateByUrl(`/planet/${planet.name}`);
  }

  /**
   * Loads data on infinite scroll event. 
   * 
   * @param event the scroll event.
   */
  loadData(event): void {
    this.planetSub[1] = this._swapiFetchService.genericFetch(this.nextUrl)
      .subscribe(
        (results: object) => {
          this.planets = this.planets.concat(results['results']);
          this.nextUrl = results['next'];
          event.target.complete();

          if(this.planets.length === this.count) {
            event.target.disabled = true;
          }
      });
  }

  /**
   * Gets first 20 planets through swapi service. 
   * 
   */
  private getPlanets(): void {
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
          this.count = results['count'];
          this.nextUrl = results['next'];
          this.planets = this.planets.concat(results['results']);

          console.log("Planets: ", this.planets);
        }
      );
  }

  private unsubscribe(): void {
    for(let i = 0; i < this.planetSub.length; i++) {
      if(this.planetSub[i] !== undefined) {
        this.planetSub[i].unsubscribe();
      }
    }
  }
}
