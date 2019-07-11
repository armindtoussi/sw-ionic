import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//Ionic
import { IonInfiniteScroll } from '@ionic/angular';
//Services
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';
//RXJS
import { Subscription } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
//Models
import { Starship } from '../models/starships.model';

@Component({
  selector: 'app-starships',
  templateUrl: './starships.page.html',
  styleUrls: ['./starships.page.scss'],
})
export class StarshipsPage implements OnInit, OnDestroy {
  /** Infinit scroll view child ref. */
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  /** Subscriptions. */
  shipSub: Subscription[];
  /** Ship fetch result. */
  ships: Starship[];
  /** Next set of ship results url. */
  nextUrl: string;
  /** Total number of results.  */
  count: number;

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
    this.shipSub = [];
    this.getShips();
  }

  /**
   * lifecycle hook runs when component is destroyed. 
   * Unsubs to subs.
   */
  ngOnDestroy(): void {
    this.unsubscribe();
  }

  /**
   * Click function that navigates to ship details page.
   * Passes id, and data to service that gets resolved. 
   * 
   * @param ship the ship that was clicked. 
   */
  displayShip(ship: Starship): void {
    this._dataService.setData(ship.name, ship);
    this.router.navigateByUrl(`/starship/${ship.name}`);
  }
  
  /**
   * Infinite scroll hook, fetchings the next set of results for display.
   * @param event the screen scroll event that triggers this.
   */
  loadData(event: any): void {
    this.shipSub[1] = this._swapiFetchService.genericFetch(this.nextUrl)
      .subscribe(
        (results: object) => {
          this.ships = this.ships.concat(results['results'])
                                 .sort((a: Starship, b: Starship) => this.sortArr(a.name, b.name));;
          this.nextUrl = results['next'];
          event.target.complete();

          if(this.ships.length === this.count) {
            event.target.disabled = true;
          }
        }
      );
  }

  /**
   * Fetches the initial 20 results for display
   */
  private getShips(): void {
    this.shipSub[0] = this._swapiFetchService.getStarships()
      .pipe(
        map(res => {
          this.nextUrl = res['next'];
          this.ships = res['results'];
        }),
        map(res => this._swapiFetchService.genericFetch(this.nextUrl)),
        flatMap(res => res)
      ).subscribe(
        (results: object) => {
          this.count = results['count'];
          this.nextUrl = results['next'];
          this.ships = this.ships.concat(results['results'])
                                 .sort((a: Starship, b: Starship) => this.sortArr(a.name, b.name));
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
  private unsubscribe(): void {
    for(let i = 0; i < this.shipSub.length; i++) {
      if(this.shipSub[i] !== undefined) {
        this.shipSub[i].unsubscribe();
      }
    }
  }
}
