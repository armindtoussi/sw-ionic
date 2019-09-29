// Ng
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// RXJS
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Services
import { ToastService } from 'src/app/services/toast.service';
import { SpeciesService } from '../species.service';
// Models
import { Species } from 'src/app/models/species.model';
import { Film } from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';
// ENV
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-species-page',
  templateUrl: './species-page.component.html',
  styleUrls: ['./species-page.component.scss'],
})
export class SpeciesPageComponent implements OnInit, OnDestroy {

  /** Data holding vars. */
  data: Species;
  films: Film[];
  people: Character[];

  /* Subject for Subscription management */
  private unsub$: Subject<void>;

  /**
   * ctor
   * @param route  Activated route ref.
   * @param router router ref.
   * @param toast toast presentation service.
   * @param cache the caching service.
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private speciesService: SpeciesService,
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
    if (id && segment) {
      this.router.navigateByUrl(`/${segment}/${id}`);
    } else {
      this.presentToast(`/`);
    }
  }

  /**
   * Fetches films that feature this species.
   */
  public fetchFilms(): void {
    if (this.data.films.length === 0) {
      return;
    }

    this.speciesService.fetchArrayData(this.data.films)
      .pipe(
        takeUntil(this.unsub$),
      ).subscribe((data: Film[]) => {
        this.films = data.sort((a: Film, b: Film) =>
                     this.sortArr(a.episode_id.toString(),
                                  b.episode_id.toString()));

      });
  }

  /**
   * Fetches Characters associated to this movie.
   */
  public fetchPeople(): void {
    if (this.data.people.length === 0) {
      return;
    }

    this.speciesService.fetchArrayData(this.data.people)
      .pipe(
        takeUntil(this.unsub$),
      ).subscribe((data: Character[]) => {
        this.people = data.sort((a: Character, b: Character) =>
                      this.sortArr(a.name, b.name));
      });
  }

  /**
   * Gets main species data in the case of a reload or manual nav to this page.
   */
  public getSpecies(): void {
    const id = this.parsePath();

    this.speciesService.fetchSpecies(id).pipe(
      takeUntil(this.unsub$),
    ).subscribe((result: Species) => {
      if (result) {
        this.data = result;
        this.getExtraData();
      } else {
        this.presentToast(`/`);
      }
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

  /**
   * Handles main data on load of page.
   */
  public handleData(): void {
    if (this.route.snapshot.data.special) {
      this.data = this.route.snapshot.data.special;
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
  public sortArr(a: string, b: string): number {
    return (a).localeCompare(b);
  }

  /**
   * Helper function to present not found toast, and redirect.
   * @param url url to redirect to.
   */
  public async presentToast(url: string): Promise<void> {
    await this.toast.presentToast(environment.notFound).then(
      () => {
        this.router.navigateByUrl(url);
    });
  }

  /**
   * Fetches extra data related to a page.
   */
  public getExtraData(): void {
    this.fetchFilms();
    this.fetchPeople();
  }
}
