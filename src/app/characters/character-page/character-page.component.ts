import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Models
import { Character } from 'src/app/models/character.model';
import { Film } from 'src/app/models/films.model';
import { Species } from 'src/app/models/species.model';
import { Starship } from 'src/app/models/starships.model';
import { Vehicle } from 'src/app/models/vehicles.model';
// RXJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Services
import { ToastService } from 'src/app/services/toast.service';
import { CharacterService } from '../character.service';
// ENV
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.scss'],
})
export class CharacterPageComponent implements OnInit, OnDestroy {

  /** Data holding variables. */
  data: Character;
  films: Film[];
  species: Species[];
  ships: Starship[];
  vehicles: Vehicle[];
  /* Subject for Subscription management */
  private unsub$: Subject<void>;

  /**
   * ctor
   * @param route  Activated route ref.
   * @param router router ref.
   * @param toast toast presentation service.
   * @param charService the char service.
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private charService: CharacterService,
              private toast: ToastService) { }

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
   * Fetches films this character was featured in.
   */
  public fetchFilms(): void {
    if (this.data.films.length === 0) {
      return;
    }

    this.charService.fetchArrayData(this.data.films)
      .pipe(
        takeUntil(this.unsub$)
      ).subscribe((data: Film[]) => {
        this.films = data.sort((a: Film, b: Film) =>
                     this.sortArr(a.episode_id.toString(),
                                  b.episode_id.toString()));
      });
  }

  /**
   * Fetches Species associated to this movie.
   */
  public fetchSpecies(): void {
    if (this.data.species.length === 0) {
      return;
    }

    this.charService.fetchArrayData(this.data.species)
      .pipe(
        takeUntil(this.unsub$),
      ).subscribe((data: Species[]) => {
        this.species = data.sort((a: Species, b: Species) =>
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

    this.charService.fetchArrayData(this.data.starships)
      .pipe(
        takeUntil(this.unsub$)
      ).subscribe((data: Starship[]) => {
        this.ships = data.sort((a: Starship, b: Starship) =>
                     this.sortArr(a.name, b.name));
      });
  }

  /**
   * Fetches Vehicles associated to this movie.
   */
  public fetchVehicles(): void {
    if (this.data.vehicles.length === 0) {
      return;
    }

    this.charService.fetchArrayData(this.data.vehicles)
      .pipe(
        takeUntil(this.unsub$)
      ).subscribe((data: Vehicle[]) => {
        this.vehicles = data.sort((a: Vehicle, b: Vehicle) =>
                        this.sortArr(a.name, b.name));
      });
  }

  /**
   * Gets main character data in the case of a reload or
   * manual nav to this page.
   */
  public getCharacter(): void {
    const id = this.parsePath();

    this.charService.fetchCharacter(id).pipe(
      takeUntil(this.unsub$),
    ).subscribe((result: Character) => {
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
      this.getCharacter();
    }
  }

  /**
   * Fetches extra data related to a page.
   */
  public getExtraData(): void {
    this.fetchFilms();
    this.fetchSpecies();
    this.fetchStarships();
    this.fetchVehicles();
  }

  /**
   * Parses path to get id segment from url path.
   */
  public parsePath(): any {
    const idx = this.router.url.lastIndexOf('/');
    const id  = this.router.url.slice(idx + 1);
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
   * Helper function to present not found toast, and redirect.
   * @param url url to redirect to.
   */
  private async presentToast(url: string): Promise<void> {
    await this.toast.presentToast(environment.notFound).then(
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
}
