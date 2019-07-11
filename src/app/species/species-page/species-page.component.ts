import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
//RXJS
import { Subscription } from 'rxjs';
//Services 
import { CacheService } from 'src/app/services/cache.service';
import { ToastService } from 'src/app/services/toast.service';
//Models
import { Species }   from 'src/app/models/species.model';
import { Film }      from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';
//ENV
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-species-page',
  templateUrl: './species-page.component.html',
  styleUrls: ['./species-page.component.scss'],
})
export class SpeciesPageComponent implements OnInit, OnDestroy {
  /** Species subs. */
  speciesSubs: Subscription[];
  /** Data holding vars. */
  data:   Species;
  films:  Film[];
  people: Character[];

  /**
   * ctor
   * @param route  Activated route ref.
   * @param router router ref. 
   * @param _toast toast presentation service. 
   * @param _cache the caching service. 
   */
  constructor(private route:  ActivatedRoute,
              private router: Router,
              private _cache: CacheService,
              private _toast: ToastService) { }
  
  /**
   * lifecycle hook runs when component is being created. 
   * Handles data. 
   */
  ngOnInit(): void {
    this.speciesSubs = [];
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
    if(id && segment) {
      this.router.navigateByUrl(`/${segment}/${id}`);
    } else {
      this.presentToast(`/`);
    }
  }

  /**
   * Gets main species data in the case of a reload or manual nav to this page. 
   */
  private getSpecies(): void {
    let id = this.parsePath();

    this.speciesSubs[0] = this._cache.search(environment.swapiSpecies, id)
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
   * Fetches films that feature this species.
   */
  private fetchFilms(): void {
    if(this.data.films.length === 0) {
      return;
    }

    this.speciesSubs[1] = this._cache.fetch(this.data.films)
      .subscribe((data: any) => {
        this.films = data.sort((a: Film, b: Film) => 
                     this.sortArr(a.episode_id.toString(), b.episode_id.toString()));
      });
  }

  /**
   * Fetches Characters associated to this movie. 
   */
  private fetchPeople(): void {
    if(this.data.people.length === 0) {
      return; 
    }

    this.speciesSubs[2] = this._cache.fetch(this.data.people)
      .subscribe((data: any) => {
        this.people = data.sort((a: Character, b: Character) => this.sortArr(a.name, b.name));
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

  /**
   * Handles main data on load of page. 
   */
  private handleData(): void { 
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
      this.getExtraData();
    } else {
      this.getSpecies();
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
   * Fetches extra data related to a page. 
   */
  private getExtraData(): void {
    this.fetchFilms();
    this.fetchPeople();
  }

  /**
   * Unsubs from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.speciesSubs.length; i++) {
      if(this.speciesSubs[i] !== undefined) {
        this.speciesSubs[i].unsubscribe();
      }
    }
  }
}
