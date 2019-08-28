import { Component, OnInit,
         OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// Services
import { DataService } from '../services/data.service';
import { PlanetsService } from './planets.service';
// Ionic
import { IonInfiniteScroll } from '@ionic/angular';
// RXJS
import { Subscription } from 'rxjs';
// Models
import { Planet } from '../models/planets.model';


/**
 * Planet Page.
 *
 * This page holds an example of how to do Observables with
 * subscription using .add() to add more subscriptions under a
 * single variable. This way we can only use one variable to hold
 * it all.
 *
 * TODO - add error handling, using the bookmark we saved on chrome as
 *        inspiration so-to-speak. when i do error handling, i should
 *        also do UI feedback on waiting for response.
 *        Can maybe use ng-container element in conjunction with ngIf
 *        in order to implement ui state feedback.
 */
@Component({
  selector: 'app-planets',
  templateUrl: './planets.page.html',
  styleUrls: ['./planets.page.scss'],
})
export class PlanetsPage implements OnInit, OnDestroy {
  /** Infinite scroll view child reference. */
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  /** Planets subscription. */
  planetsSub: Subscription;
  /** Planets array. */
  planets: Planet[];
  /** The search text from ion-input box. */
  searchText: string;
  /** State boolean recognizing an in progress search. */
  isSearch: boolean;

  /**
   * ctor.
   * 
   * @param _swapiFetchService swapi fetch service.
   * @param dataService data service for passing data.
   * @param router routing.
   */
  constructor(private planetService: PlanetsService,
              private dataService: DataService,
              private router: Router) { }

  /**
   * OnInit lifecycle hook.
   * Inits the planet list.
   */
  ngOnInit(): void {
    this.planetsSub = new Subscription();
    this.getPlanets();
  }

  /**
   * OnDestroy lifecycle hook. 
   * Unsubscribes to observables.
   */
  ngOnDestroy(): void {
    this.planetsSub.unsubscribe();
  }

  /**
   * Determines if it's a number.
   * @param arg value to check if it's a number.
   */
  isNumber(arg: any): boolean  {
    return !isNaN(parseFloat(arg)) && !isNaN(arg - 0);
  }

  /**
   * Issues a search to the api for the given text.
   * Responsible for resetting search when ion-input box is reset.
   */
  search(): void {
    if (this.searchText === '' || this.searchText === undefined) {
      return this.resetSearch();
    }

    const sub$ = this.planetService.search(this.searchText)
      .subscribe((results: Planet[]) => {
        this.isSearch = true;
        this.planets = results;
    });

    this.planetsSub.add(sub$);
  }

  /**
   * Reset search function sets search to false and
   * fetches regular data list.
   */
  resetSearch(): void {
    this.isSearch = false;
    this.getPlanets();
  }

  /**
   * UI/UX boolean to control ion-infinite scroll.
   * Fetches from character Service.
   */
  getHasNext(): boolean {
    if (this.planetService.hasNext() === null) {
      return false;
    }
    return true;
  }

  /**
   * Navigates to planet detail display page.
   * @param planet planet to display.
   */
  displayPlanet(planet: Planet): void {
    this.dataService.setData(planet.name, planet);
    this.router.navigateByUrl(`/planet/${planet.name}`);
  }

  /**
   * Loads data on infinite scroll event.
   * @param event the scroll event.
   */
  loadData(event: any): void {
    const planet$ = this.planetService.loadMore()
      .subscribe(
        (res: Planet[]) => {
          this.planets = res;

          if (event !== null) {
            event.target.complete();
          }

          if (this.planets.length === this.planetService.getCount()) {
            event.target.disabled = true;
          }
    });

    this.planetsSub.add(planet$);
  }

  /**
   * Gets first 20 planets through swapi service.
   */
  public getPlanets(): void {
    const sub$ = this.planetService.getPlanets()
      .subscribe((results: Planet[]) => {
        this.planets = results;
    });

    this.planetsSub.add(sub$);
  }
}
