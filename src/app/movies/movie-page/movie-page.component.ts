// Ng
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Ionic
import { ModalController } from '@ionic/angular';
// Models
import { Film } from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';
import { Planet } from 'src/app/models/planets.model';
import { Species } from 'src/app/models/species.model';
import { Starship } from 'src/app/models/starships.model';
import { Vehicle } from 'src/app/models/vehicles.model';
// Services
import { ToastService } from 'src/app/services/toast.service';
import { CacheService } from 'src/app/services/cache.service';
import { MoviesService } from '../movies.service';
// RXJS
import { Subscription, Subject } from 'rxjs';
// Env
import { environment } from 'src/environments/environment';
// Modal
import { CrawlModalPage } from '../crawl-modal/crawl-modal.page';
import { takeUntil } from 'rxjs/operators';

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
  planets: Planet[];
  species: Species[];
  starships: Starship[];
  vehicles: Vehicle[];
  /* Subject for Subscription management */
  private unsub$: Subject<void>;

  /**
   * ctor
   * @param route  Activated route ref.
   * @param router router ref.
   * @param toastService toast presentation service.
   * @param cacheService the caching service.
   * @param modalCtrl controller for modals.
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastService: ToastService,
              private movieService: MoviesService,
              private modalCtrl: ModalController) { }

  /**
   * lifecycle hook runs when component is being created.
   * Handles data.
   */
  ngOnInit(): void {
    this.unsub$ = new Subject();
    this.handleData();
  }

  /**
   * lifecycle hook runs when component is destroyed.
   * Unsubs to subs.
   */
  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
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
    if (typeof id === 'string' && id.search('//')) {
      id = this.replaceSlashses(id);
    }

    if (id && segment) {
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
        crawl: this.data.opening_crawl,
        id: this.data.episode_id,
        title: this.data.title,
      }
    });

    return await modal.present();
  }

  /**
   * Fetches Vehicles associated to this movie.
   */
  public fetchVehicles(): void {
    if (this.data.vehicles.length === 0) {
      return;
    }

    this.movieService.fetchArrayData(this.data.vehicles)
      .pipe(
        takeUntil(this.unsub$)
      ).subscribe((data: Vehicle[]) => {
        this.vehicles = data.sort((a: Vehicle, b: Vehicle) =>
                        this.sortArr(a.name, b.name));
      });
  }

  /**
   * Fetches Starships associated to this movie.
   */
  public fetchStarships(): void {
    if (this.data.starships.length === 0) {
      return;
    }

    this.movieService.fetchArrayData(this.data.starships)
      .pipe(
        takeUntil(this.unsub$),
      ).subscribe((data: Starship[]) => {
        this.starships = data.sort((a: Starship, b: Starship) =>
                         this.sortArr(a.name, b.name));
      });
  }

  /**
   * Fetches Species associated to this movie.
   */
  public fetchSpecies(): void {
    if (this.data.species.length === 0) {
      return;
    }

    this.movieService.fetchArrayData(this.data.starships)
      .pipe(
        takeUntil(this.unsub$),
      ).subscribe((data: Species[]) => {
        this.species = data.sort((a: Species, b: Species) =>
                       this.sortArr(a.name, b.name));
      });
  }

  /**
   * Fetches Planets associated to this movie.
   */
  public fetchPlanets(): void {
    if (this.data.planets.length === 0) {
      return;
    }

    this.movieService.fetchArrayData(this.data.planets)
      .pipe(
        takeUntil(this.unsub$),
      ).subscribe((data: Planet[]) => {
        this.planets = data.sort((a: Planet, b: Planet) =>
                       this.sortArr(a.name, b.name));
      });
  }

  /**
   * Fetches Characters associated to this movie.
   */
  public fetchCharacters(): void {
    if (this.data.characters.length === 0) {
      return;
    }

    this.movieService.fetchArrayData(this.data.characters)
      .pipe(
        takeUntil(this.unsub$),
      ).subscribe((data: Character[]) => {
        this.characters = data.sort((a: Character, b: Character) =>
                           this.sortArr(a.name, b.name));
      });
  }

  /**
   * Gets main movie data in the case of a reload or manual nav to this page.
   */
  public async getMovie(): Promise<void> {
    const id = this.parsePath();

    this.movieService.fetchMovie(id).pipe(
      takeUntil(this.unsub$),
    ).subscribe((result: Film) => {
      if (result) {
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
  public handleData(): void {
    if (this.route.snapshot.data.special) {
      this.data = this.route.snapshot.data.special;
      this.getExtraData();
    } else {
      this.getMovie();
    }
  }

  /**
   * Fetches extra data related to a page.
   */
  public getExtraData(): void {
      this.fetchCharacters();
      this.fetchPlanets();
      this.fetchSpecies();
      this.fetchStarships();
      this.fetchVehicles();
  }

  /**
   * String sort function.
   * @param a string to sort
   * @param b string to sort
   */
  public sortArr(a: string, b: string): number {
    return (a).localeCompare(b);
  }

  /**
   * Helper function to present not found toast, and redirect.
   * @param url url to redirect to.
   */
  public async presentToast(url: string): Promise<void> {
    await this.toastService.presentToast(environment.notFound).then(
      () => {
        this.router.navigateByUrl(url);
    });
  }

  /**
   * replace slashes in vehicle ids for url segment.
   * @param str string to replace slash.
   */
  public replaceSlashses(str: string): string {
    return str.replace(/\//g, '_');
  }

  /**
   * Parses path to get id segment from url path.
   */
  public parsePath(): number {
    const idx = this.router.url.lastIndexOf('/');
    const id  = this.router.url.slice(idx + 1);
    return parseInt(id, 10);
  }
}
