// Ng
import { Component, OnInit, 
         ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// Ionic
import { IonInfiniteScroll } from '@ionic/angular';
// RXJS
import { takeWhile } from 'rxjs/operators';
// Services
import { SpeciesService } from './species.service';
import { DataService } from '../services/data.service';
// Models
import { Species } from '../models/species.model';

/**
 * Species Page.
 *
 * This page holds an exmaple of how to do Observables using the
 * takeWhile operator in conjunction with a boolean to control the
 * flow of data.
 *
 * TODO - add error handling, using the bookmark we saved on chrome as
 *        inspiration so-to-speak. when i do error handling, i should
 *        also do UI feedback on waiting for response.
 *        Can maybe use ng-container element in conjunction with ngIf
 *        in order to implement ui state feedback.
 */
@Component({
  selector: 'app-species',
  templateUrl: './species.page.html',
  styleUrls: ['./species.page.scss'],
})
export class SpeciesPage implements OnInit, OnDestroy {
  /** View child ref for infinit scroll element. */
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  /** Species fetch results. */
  species: Species[];
  /** The search text from ion-input box. */
  searchText: string;
  /** State boolean recognizing an in progress search. */
  isSearch: boolean;
  /** Observable sub control boolean. */
  destroy: boolean;

  /**
   * ctor.
   * @param speciesService species module service.
   * @param dataService passing data service.
   * @param router router.
   */
  constructor(private speciesService: SpeciesService,
              private dataService: DataService,
              private router: Router) { }

  /**
   * Lifecycle hook inits subs.
   */
  ngOnInit(): void {
    this.destroy = true;
    this.getSpecies();
  }

  /**
   * lifecycle hook, unsubs.
   */
  ngOnDestroy(): void {
    this.destroy = false;
  }

  /**
   * Fetches the first 20 species results.
   */
  public getSpecies(): void {
    this.speciesService.getSpecies().pipe(
      takeWhile(() => this.destroy)
    ).subscribe(
      (results: Species[]) => {
        this.species = results;
    });
  }

  /**
   * Loads more data on scroll. (infinite scroll functionality).
   * @param event scroll event of reaching bottom of list.
   */
  loadData(event: any): void {
    this.speciesService.loadMore().pipe(
      takeWhile(() => this.destroy),
    ).subscribe(
      (results: Species[]) => {
        this.species = results;

        if (event !== null) {
          event.target.complete();
        }

        if (this.species.length === this.speciesService.getCount()) {
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

    this.speciesService.search(this.searchText)
      .pipe(
        takeWhile(() => this.destroy),
      ).subscribe((results: Species[]) => {
        this.isSearch = true;
        this.species = results;
        console.log('Species: ', this.species);
      });
  }

  /**
   * Reset search function sets search to false and
   * fetches regular data list.
   */
  resetSearch(): void {
    this.isSearch = false;
    this.getSpecies();
  }

  /**
   * UI/UX boolean to control ion-infinite scroll.
   * Fetches from character Service.
   */
  getHasNext(): boolean {
    if (this.speciesService.hasNext() === null) {
      return false;
    }
    return true;
  }

  /**
   * navigate to species display page
   * @param species the species to display.
   */
  displaySpecies(species: Species): void {
    this.dataService.setData(species.name, species);
    this.router.navigateByUrl(`/species/${species.name}`);
  }
}
