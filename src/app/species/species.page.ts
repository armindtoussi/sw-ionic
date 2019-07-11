import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//Ionic
import { IonInfiniteScroll } from '@ionic/angular';
//RXJS
import { Subscription } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
//Services
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';
//Models
import { Species } from '../models/species.model';


@Component({
  selector: 'app-species',
  templateUrl: './species.page.html',
  styleUrls: ['./species.page.scss'],
})
export class SpeciesPage implements OnInit, OnDestroy {
  /** View child ref for infinit scroll element. */
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  /** Species subs. */
  speciesSub: Subscription[];
  /** Species fetch results. */
  species: Species[];
  /** Url next set of results. */
  nextUrl: string;
  /** Total count of results */
  count: number;

  /**
   * ctor.
   * @param _swapiFetchService api fetch service layer.
   * @param _dataService passing data service.
   * @param router router.
   */
  constructor(private _swapiFetchService: SwapiService,
              private _dataService: DataService,
              private router: Router) { }

  /**
   * Lifecycle hook inits subs.
   */    
  ngOnInit(): void {
    this.speciesSub = [];
    this.getSpecies();
  }

  /**
   * lifecycle hook, unsubs. 
   */
  ngOnDestroy(): void {
    this.unsubscribe();
  }

  /**
   * navigate to species display page
   * @param species the species to display.
   */
  displaySpecies(species: Species): void {
    this._dataService.setData(species.name, species);
    this.router.navigateByUrl(`/species/${species.name}`);
  }

  /**
   * Loads data on infinite scroll event. 
   * 
   * @param event the scroll event.
   */
  loadData(event: any): void {
    this.speciesSub[1] = this._swapiFetchService.genericFetch(this.nextUrl)
      .subscribe(
        (data: object) => {
          this.species = this.species.concat(data['results'])
                                     .sort((a: Species, b: Species) => this.sortArr(a.name, b.name));
          this.nextUrl = data['next'];
          event.target.complete();

          if(this.species.length === this.count) {
            event.target.disabled = true;
          }
      });
  }

  /**
   * Fetches the first 20 species results.
   */
  private getSpecies(): void {
    this.speciesSub[0] = this._swapiFetchService.getSpecies()
      .pipe(
        map(res => {
          this.nextUrl = res['next'];
          this.species = res['results'];
        }),
        map(res => this._swapiFetchService.genericFetch(this.nextUrl)),
        flatMap(res => res)
      ).subscribe(
        (results: object) => {
          this.count = results['count'];
          this.nextUrl = results['next'];
          this.species = this.species.concat(results['results'])
                                     .sort((a: Species, b: Species) => this.sortArr(a.name, b.name));
        }
      );
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
   * Unsubscribes from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.speciesSub.length; i++) {
      if(this.speciesSub[i] !== undefined) {
        this.speciesSub[i].unsubscribe();
      }
    }
  }
}
