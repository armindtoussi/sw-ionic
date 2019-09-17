// Ng
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// Ionic
import { IonInfiniteScroll } from '@ionic/angular';
// Services
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';
import { StarshipsService } from './starships.service';

// RXJS
import { Subscription, Subject } from 'rxjs';
import { map, flatMap, takeUntil } from 'rxjs/operators';
// Models
import { Starship } from '../models/starships.model';
// ENV
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-starships',
  templateUrl: './starships.page.html',
  styleUrls: ['./starships.page.scss'],
})
export class StarshipsPage implements OnInit, OnDestroy {
  /** Infinit scroll view child ref. */
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  /** Ship fetch result. */
  ships: Starship[];
  /** Next set of ship results url. */
  nextUrl: string;
  /** Total number of results.  */
  count: number;
  /** The search text from ion-input box. */
  searchText: string;
  /** State boolean recognizing an in progress search. */
  isSearch: boolean;

  private unsubscribe$: Subject<void>;

  /**
   * ctor
   * @param swapiFetchService sw api service
   * @param dataService data passing service
   * @param router router
   */
  constructor(private swapiFetchService: SwapiService,
              private shipService: StarshipsService,
              private dataService: DataService,
              private router: Router) { }

  /**
   * lifecycle hook runs when component is being created.
   * inits subs gets data.
   */
  ngOnInit(): void {
    this.unsubscribe$ = new Subject();
    this.getShips();
  }

  /**
   * lifecycle hook runs when component is destroyed.
   * Unsubs to subs.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Fetches the initial 20 results for display
   */
  public getShips(): void {
    this.shipService.getStarships().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(
      (results: Starship[]) => {
        this.ships = results;
    });
  }

  /**
   * Infinite scroll hook, fetchings the next set of results for display.
   * @param event the screen scroll event that triggers this.
   */
  loadData(event: any): void {
    this.shipService.loadMore().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(
      (results: Starship[]) => {
        this.ships = results;

        if (event !== null) {
          event.target.complete();
        }

        if (this.ships.length === this.shipService.getCount()) {
          event.target.disabled = true;
        }
    });
  }

  /**
   * Issues a search to the api for the given text.
   * Responsible for resetting search when ion-input box is reset.
   */
  search(): void {
    if (this.searchText === '' || this.searchText === undefined) {
      return this.resetSearch();
    }

    this.shipService.search(this.searchText)
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe((results: Starship[]) => {
        this.isSearch = true;
        this.ships = results;
      });
  }

  /**
   * Reset search function sets search to false and
   * fetches regular data list.
   */
  resetSearch(): void {
    this.isSearch = false;
    this.getShips();
  }

  /**
   * UI/UX boolean to control ion-infinite scroll.
   * Fetches from character Service.
   */
  getHasNext(): boolean {
    if (this.shipService.hasNext() === null) {
      return false;
    }
    return true;
  }

  /**
   * Click function that navigates to ship details page.
   * Passes id, and data to service that gets resolved.
   * 
   * @param ship the ship that was clicked.
   */
  displayShip(ship: Starship): void {
    this.dataService.setData(ship.name, ship);
    this.router.navigateByUrl(`/starship/${ship.name}`);
  }
}
