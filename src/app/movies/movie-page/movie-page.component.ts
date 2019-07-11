import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
//Ionic
import { ModalController } from '@ionic/angular';
//Models
import { Film }      from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';
import { Planet }    from 'src/app/models/planets.model';
import { Species }   from 'src/app/models/species.model';
import { Starship }  from 'src/app/models/starships.model';
import { Vehicle }   from 'src/app/models/vehicles.model';
//Services
import { ToastService }   from 'src/app/services/toast.service';
import { CacheService } from 'src/app/services/cache.service';
//RXJS
import { Subscription } from 'rxjs';
//Env 
import { environment } from 'src/environments/environment';
//Modal
import { CrawlModalPage } from '../crawl-modal/crawl-modal.page';


@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss'],
})
export class MoviePageComponent implements OnInit, OnDestroy {
  /** Subscriptions.  */
  movieSubs: Subscription[];

  /** Data holding variables. */
  data: Film;
  characters: Character[];
  planets:    Planet[];
  species:    Species[];
  starships:  Starship[];
  vehicles:   Vehicle[];

  /**
   * ctor
   * @param route  Activated route ref.
   * @param router router ref. 
   * @param _toast toast presentation service. 
   * @param _cache the caching service. 
   * @param modalCtrl controller for modals. 
   */
  constructor(private route:     ActivatedRoute, 
              private router:    Router,
              private _toast:    ToastService,
              private _cache:    CacheService,
              private modalCtrl: ModalController) { }
  
  /**
   * lifecycle hook runs when component is being created. 
   * Handles data. 
   */
  ngOnInit(): void {
    this.movieSubs = [];
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
    if(id.search('//')) {
      id = this.replaceSlashses(id);
    }

    if(id && segment) {
      this.router.navigateByUrl(`/${segment}/${id}`);
    } else {
      this.presentToast(`/`);
    }
  }

  /**
   * Presents the Movie Crawl modal.
   */
  async presentCrawlModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CrawlModalPage,
      componentProps: {
        'crawl': this.data.opening_crawl,
        'id': this.data.episode_id,
        'title': this.data.title,
      }
    });

    return await modal.present();
  }

  /**
   * Fetches Vehicles associated to this movie. 
   */
  private fetchVehicles(): void {
    if(this.data.vehicles.length === 0) {
      return; 
    }

    this.movieSubs[4] = this._cache.fetch(this.data.vehicles)
      .subscribe((data: any) => {
        this.vehicles = data.sort((a: Vehicle, b: Vehicle) => this.sortArr(a.name, b.name));
      });
  }

  /**
   * Fetches Starships associated to this movie. 
   */
  private fetchStarships(): void {
    if(this.data.starships.length === 0) {
      return;
    }

    this.movieSubs[3] = this._cache.fetch(this.data.starships)
      .subscribe((data: any) => {
        this.starships = data.sort((a: Starship, b: Starship) => this.sortArr(a.name, b.name));
      }); 
  }

  /**
   * Fetches Species associated to this movie. 
   */
  private fetchSpecies(): void {
    if(this.data.species.length === 0) {
      return; 
    }

    this.movieSubs[2] = this._cache.fetch(this.data.species)
      .subscribe((data: any) => {
        this.species = data.sort((a: Species, b: Species) => this.sortArr(a.name, b.name));
      });
  }

  /**
   * Fetches Planets associated to this movie. 
   */
  private fetchPlanets(): void {
    if(this.data.planets.length === 0) {
      return;
    }

    this.movieSubs[1] = this._cache.fetch(this.data.planets)  
      .subscribe((data: any) => {
        this.planets = data.sort((a: Planet, b: Planet) => this.sortArr(a.name, b.name));
      });
  }

  /**
   * Fetches Characters associated to this movie. 
   */
  private fetchCharacters(): void {
    if(this.data.characters.length === 0) {
      return;
    }

    this.movieSubs[0] = this._cache.fetch(this.data.characters)
      .subscribe((data: any) => {
          this.characters = data.sort((a: Character, b: Character) => this.sortArr(a.name, b.name)); 
      });
  }

  /**
   * Gets main movie data in the case of a reload or navigation to this page. 
   */
  private async getMovie(): Promise<void> {
    let id = this.parsePath();

    await this._cache.fetchSingleEntry(id, environment.MOVIES_KEY, 'episode_id')
      .then((result) => {
        if(result) {
          this.data = result;

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
      this.getMovie();
    }
  }

  /**
   * Fetches extra data related to a page. 
   */
  private getExtraData(): void {
      this.fetchCharacters();
      this.fetchPlanets();
      this.fetchSpecies();
      this.fetchStarships();
      this.fetchVehicles();
  }

  /**
   * Unsubs from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.movieSubs.length; i++) {
      if(this.movieSubs[i] !== undefined) {
        this.movieSubs[i].unsubscribe();
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
   * replace slashes in vehicle ids for url segment.
   * @param str string to replace slash.
   */
  private replaceSlashses(str: string): string {
    return str.replace(/\//g, "_");
  }

  /**
   * Parses path to get id segment from url path. 
   */
  private parsePath(): number {
    let idx = this.router.url.lastIndexOf('/');
    let id  = this.router.url.slice(idx + 1);
    return parseInt(id);
  }
}