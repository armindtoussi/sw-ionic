import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
//RXJS 
import { Subscription } from 'rxjs';
//Models
import { Starship }  from 'src/app/models/starships.model';
import { Character } from 'src/app/models/character.model';
import { Film }      from 'src/app/models/films.model';
//Services
import { CacheService } from 'src/app/services/cache.service';
import { ToastService } from 'src/app/services/toast.service';
//ENV
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-starships-page',
  templateUrl: './starships-page.component.html',
  styleUrls: ['./starships-page.component.scss'],
})
export class StarshipsPageComponent implements OnInit, OnDestroy {
  /** Subscriptions.  */
  shipSub: Subscription[];

  /** Data holding variables. */
  data: Starship;
  films: Film[];
  pilots: Character[]

  /**
   * ctor
   * @param route  Activated route ref.
   * @param router router ref. 
   * @param _toast toast presentation service. 
   * @param _cache the caching service. 
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private _cache: CacheService,
              private _toast: ToastService) { }

  /**
   * lifecycle hook runs when component is being created. 
   * Handles data. 
   */
  ngOnInit(): void {
    this.shipSub = [];
    this.handleData();
  }

  /**
   * lifecycle hook runs when component is destroyed. 
   * Unsubs to subs.
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

  /**
   * Navigates to a sub-page, for characters, planets etc. 
   * @param id the id/name of the element.
   * @param segment the type of element.
   */
  navToElementPage(id: string, segment: string): void {
    if(typeof id === 'string' && id.search('//')) {
      id = this.replaceSlashses(id);
    }

    if(id && segment) {
      this.router.navigateByUrl(`/${segment}/${id}`);
    } else {
      this.presentToast(`/`);
    }
  }

  /**
   * Fetches Films featuring this starship. 
   */
  private fetchFilms(): void {
    if(this.data.films.length === 0) {
      return;
    }

    this.shipSub[1] = this._cache.fetch(this.data.films)
      .subscribe((data: any) => {
        this.films = data.sort((a: Film, b: Film) => this.sortArr(a.episode_id.toString(), 
                                                                  b.episode_id.toString()));
      });
  }

  /**
   * Fetches Pilots that pilot this ship. 
   */
  private fetchPilots(): void {
    if(this.data.pilots.length === 0) {
      return; 
    }

    this.shipSub[2] = this._cache.fetch(this.data.pilots) 
      .subscribe((data: any) => {
        this.pilots = data.sort((a: Character, b: Character) => this.sortArr(a.name, b.name));
      });
  }

  /**
   * Gets main character data in the case of a reload or 
   * manual nav to this page. 
   */
  private getStarship(): void {
    let id = this.parsePath();
    
    this.shipSub[0] = this._cache.search(environment.swapiShips, id)
      .subscribe((data: any) => {
        if(data) {
          this.data = data.results[0];
          this.getExtraData();
        } else {
          this.presentToast(`/`);
        }
      });
  }

  /**
   * Handles main data on load of page. 
   */
  private handleData(): void {
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
      this.getExtraData();
    } else {
      this.getStarship();
    }
  }

  /**
   * Fetches extra data related to a page. 
   */
  private getExtraData(): void {
    this.fetchPilots();
    this.fetchFilms();
  }

  /**
   * Parses path to get id segment from url path. 
   */
  private parsePath(): any {
    let idx = this.router.url.lastIndexOf('/');
    let id  = this.router.url.slice(idx + 1);
    return id;
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
   * Unsubs from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.shipSub.length; i++) {
      if(this.shipSub[i] !== undefined) {
        this.shipSub[i].unsubscribe();
      }
    }
  }
    
  /**
   * Helper function to present not found toast, and redirect.
   * @param url url to redirect to.
   */
  private async presentToast(url: string): Promise<void> {
    await this._toast.presentToast(environment.notFound).then( 
      () => {
        this.router.navigateByUrl(url);
    });
  }
  
  /**
   * replace slashes in vehicle ids for url segment.
   * @param str string to replace slash.
   */
  private replaceSlashses(str: string): string {
    return str.replace(/\//g, "_");
  }
}
