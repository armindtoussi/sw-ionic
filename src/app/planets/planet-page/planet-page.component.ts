// Ng
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Models
import { Planet } from 'src/app/models/planets.model';
import { Film } from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';
// RXJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ENV
import { environment } from 'src/environments/environment';
// Services
import { ToastService } from 'src/app/services/toast.service';
import { PlanetsService } from '../planets.service';

@Component({
  selector: 'app-planet-page',
  templateUrl: './planet-page.component.html',
  styleUrls: ['./planet-page.component.scss'],
})
export class PlanetPageComponent implements OnInit, OnDestroy {

  /** Data holding variables. */
  data: Planet;
  films: Film[];
  residents: Character[];
  /* Subject for Subscription management */
  private unsub$: Subject<void>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toast: ToastService,
              private planetService: PlanetsService) { }

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
    if (id && segment) {
      this.router.navigateByUrl(`/${segment}/${id}`);
    } else {
      this.presentToast(`/`);
    }
  }

  /**
   * Fetches residents of this planet.
   */
  public fetchResidents(): void {
    if (this.data.residents.length === 0) {
      return;
    }

    this.planetService.fetchArrayData(this.data.residents)
      .pipe(
        takeUntil(this.unsub$),
      ).subscribe((data: Character[]) => {
        this.residents = data.sort((a: Character, b: Character) =>
                         this.sortArr(a.name, b.name));
      });
  }

  /**
   * Fetches films in which this planet appeared.
   */
  public fetchFilms(): void {
    if (this.data.films.length === 0) {
      return;
    }

    this.planetService.fetchArrayData(this.data.films)
      .pipe(
        takeUntil(this.unsub$),
      ).subscribe((data: Film[]) => {
        this.films = data.sort((a: Film, b: Film) =>
                     this.sortArr(a.episode_id.toString(),
                                  b.episode_id.toString()));
      });
  }

  /**
   * Gets main planet in the case of a reload or manual nav to this page
   */
  public getPlanet(): void {
    const id = this.parsePath();

    this.planetService.fetchPlanet(id).pipe(
      takeUntil(this.unsub$),
    ).subscribe((result: Planet) => {
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
      this.getPlanet();
    }
  }

  /**
   * Fetches extra data related to a page.
   */
  public getExtraData(): void {
    this.fetchResidents();
    this.fetchFilms();
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
   * Parses path to get id segment from url path. 
   */
  public parsePath(): any {
    const idx = this.router.url.lastIndexOf('/');
    const id  = this.router.url.slice(idx + 1);
    return id;
  }
}
