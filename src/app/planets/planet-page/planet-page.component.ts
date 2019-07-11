import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//Models
import { Planet }    from 'src/app/models/planets.model';
import { Film }      from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';
//RXJS
import { Subscription } from 'rxjs';
//ENV
import { environment } from 'src/environments/environment';
//Services
import { CacheService } from 'src/app/services/cache.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-planet-page',
  templateUrl: './planet-page.component.html',
  styleUrls: ['./planet-page.component.scss'],
})
export class PlanetPageComponent implements OnInit, OnDestroy {
  /** Subscriptions */
  planetSubs: Subscription[];

  /** Data holding variables. */
  data: Planet;
  films: Film[];
  residents: Character[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _toast: ToastService,
              private _cache: CacheService) { }

  /**
   * lifecycle hook runs when component is being created. 
   * Handles data. 
   */
  ngOnInit(): void {
    this.planetSubs = [];
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
    console.log("id: ", id);
    if(id && segment) {
      this.router.navigateByUrl(`/${segment}/${id}`);
    } else {
      this.presentToast(`/`);
    }
  }

  /**
   * Fetches residents of this planet. 
   */
  private fetchResidents(): void {
    if(this.data.residents.length === 0) {
      return;
    }

    this.planetSubs[0] = this._cache.fetch(this.data.residents)
      .subscribe((data: any) => {
        this.residents = data.sort((a: Character, b: Character) => this.sortArr(a.name, b.name));
      });
  }

  /**
   * Fetches films in which this planet appeared.
   */
  private fetchFilms(): void {
    if(this.data.films.length === 0) {
      return;
    }

    this.planetSubs[1] = this._cache.fetch(this.data.films)
      .subscribe((data: any) => {
        this.films = data.sort((a: Film, b: Film) => this.sortArr(a.episode_id.toString(), 
                                                                  b.episode_id.toString()));
      });
  }

  /**
   * Gets main planet in the case of a reload or manual nav to this page
   */
  private getPlanet(): void {
    let id = this.parsePath();

    this.planetSubs[2] = this._cache.search(environment.swapiPlanets, id)
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
      this.getPlanet();
    }
  }

  /**
   * Fetches extra data related to a page. 
   */
  private getExtraData(): void {
    this.fetchResidents();
    this.fetchFilms();
  }

  /**
   * Unsubs from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.planetSubs.length; i++) {
      if(this.planetSubs[i] !== undefined) {
        this.planetSubs[i].unsubscribe();
      }
    }
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
   * Parses path to get id segment from url path. 
   */
  private parsePath(): any {
    let idx = this.router.url.lastIndexOf('/');
    let id  = this.router.url.slice(idx + 1);
    return id;
  }
}
