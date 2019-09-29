// Ng
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// RXJS
import { Subject } from 'rxjs';
// Models
import { Film } from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';
import { Vehicle } from 'src/app/models/vehicles.model';
// Service
import { VehicleService } from '../vehicle.service';
import { ToastService } from 'src/app/services/toast.service';
// ENV
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-vehicles-page',
  templateUrl: './vehicles-page.component.html',
  styleUrls: ['./vehicles-page.component.scss'],
})
export class VehiclesPageComponent implements OnInit, OnDestroy {

  /** Data holding variables. */
  data: Vehicle;
  films: Film[];
  pilots: Character[];
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
              private vehicleService: VehicleService,
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
   * Fetches films this vehicle was featured in.
   */
  public fetchFilms(): void {
    if (this.data.films.length === 0) {
      return;
    }

    this.vehicleService.fetchArrayData(this.data.films)
      .pipe(
        takeUntil(this.unsub$),
      ).subscribe((data: Film[]) => {
        this.films = data.sort((a: Film, b: Film) =>
                     this.sortArr(a.episode_id.toString(),
                                  b.episode_id.toString()));
      });
  }

  /**
   * Fetches pilots that piloted this vehicle.
   */
  public fetchPilots(): void {
    if (this.data.pilots.length === 0) {
      return;
    }

    this.vehicleService.fetchArrayData(this.data.pilots)
      .pipe(
        takeUntil(this.unsub$),
      ).subscribe((data: Character[]) => {
        this.pilots = data.sort((a: Character, b: Character) =>
                      this.sortArr(a.name, b.name));
      });
  }

  /**
   * Gets main vehicle data in the case of a reload or
   * manual nav to this page.
   */
  public getVehicle(): void {
    let id = this.parsePath();
    id = this.replaceUnderscore(id);

    this.vehicleService.fetchVehicle(id).pipe(
      takeUntil(this.unsub$),
    ).subscribe((result: Vehicle) => {
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
   * Reverses the slash replacing.
   * @param str the string to replace.
   */
  public replaceUnderscore(str: string): string {
    return str.replace(/_/g, '/');
  }

  /**
   * Handles main data on load of page.
   */
  public handleData(): void {
    if (this.route.snapshot.data.special) {
      this.data = this.route.snapshot.data.special;

      this.getExtraData();
    } else {
      this.getVehicle();
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
   * Fetches extra data related to a page.
   */
  public getExtraData(): void {
    this.fetchPilots();
    this.fetchFilms();
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
   * replace slashes in vehicle ids for url segment.
   * @param str string to replace slash.
   */
  public replaceSlashses(str: string): string {
    return str.replace(/\//g, '_');
  }
}
