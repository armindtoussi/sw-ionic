// Ng
import { Component, OnInit,
         OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// Ionic
import { IonInfiniteScroll } from '@ionic/angular';
// RXJS
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
// Services
import { DataService } from '../services/data.service';
import { VehicleService } from './vehicle.service';
// Models
import { Vehicle } from '../models/vehicles.model';



@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
})
export class VehiclesPage implements OnInit, OnDestroy {
  /** Infinit scroll view child ref. */
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  /** Vehicle fetch results. */
  vehicles: Vehicle[];
  /** The search text from ion-input box. */
  searchText: string;
  /** State boolean recognizing an in progress search. */
  isSearch: boolean;

  /** Subject for unsubscribing to obs. */
  private unsubscribe$: Subject<void>;

  /**
   * ctor
   * @param swapiFetchService sw api service
   * @param dataService data passing service
   * @param router router
   */
  constructor(private vehicleService: VehicleService,
              private dataService: DataService,
              private router: Router) { }

  /**
   * lifecycle hook runs when component is being created.
   * inits subs gets data.
   */
  ngOnInit(): void {
    this.unsubscribe$ = new Subject();
    this.getVehicles();
  }

  /**
   * lifecycle hook runs when component is destroyed.
   * Unsubs to subs.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Fetches the initial 20 results for display
   */
  public getVehicles(): void {
    this.vehicleService.getVehicles().pipe(
      take(1),
    ).subscribe(
      (results: Vehicle[]) => {
        this.vehicles = results;
    });
  }

  /**
   * Infinite scroll hook, fetchings the next set of results for display.
   * @param event the screen scroll event that triggers this.
   */
  loadData(event: any): void {
    this.vehicleService.loadMore().pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(
      (results: Vehicle[]) => {
        this.vehicles = results;

        if (event !== null) {
          event.target.complete();
        }

        if (this.vehicles.length === this.vehicleService.getCount()) {
          event.target.disabled = true;
        }
    });
  }

  /**
   * Issues a search to the api for the given text.
   * Responsible for resetting search when ion-input box is reset.
   */
  search(): void {
    if (this.searchText === '' || this.searchText === undefined) {
      return this.resetSearch();
    }

    this.vehicleService.search(this.searchText)
      .pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe((results: Vehicle[]) => {
        this.isSearch = true;
        this.vehicles = results;
      });
  }

  /**
   * Reset search function sets search to false and
   * fetches regular data list.
   */
  resetSearch(): void {
    this.isSearch = false;
    this.getVehicles();
  }

  /**
   * UI/UX boolean to control ion-infinite scroll.
   * Fetches from character Service.
   */
  getHasNext(): boolean {
    if (this.vehicleService.hasNext() === null) {
      return false;
    }
    return true;
  }

  /**
   * Click function that navigates to vehicle details page.
   * Passes id, and data to service that gets resolved.
   * 
   * @param vehicle the vehicle that was clicked.
   */
  displayVehicle(vehicle: Vehicle): void {
    this.dataService.setData(this.replaceSlashses(vehicle.name), vehicle);
    this.router.navigateByUrl(`/vehicle/${this.replaceSlashses(vehicle.name)}`);
  }

  /**
   * replace slashes in vehicle ids for url segment.
   * @param str string to replace slash.
   */
  private replaceSlashses(str: string): string {
    return str.replace(/\//g, '_');
  }
}
