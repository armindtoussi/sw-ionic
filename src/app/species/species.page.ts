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
import { SpeciesModel } from '../models/species.model';


@Component({
  selector: 'app-species',
  templateUrl: './species.page.html',
  styleUrls: ['./species.page.scss'],
})
export class SpeciesPage implements OnInit, OnDestroy {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  speciesSub: Subscription[] = [];
  species: SpeciesModel[];
  nextUrl: string;
  count: number;

  constructor(private _swapiFetchService: SwapiService,
              private _dataService: DataService,
              private router: Router) { }

              
  ngOnInit(): void {
    this.getSpecies();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  displaySpecies(species: SpeciesModel): void {
    console.log("clicked: ", species);
    this._dataService.setData(species.name, species);
    this.router.navigateByUrl(`/species/${species.name}`);
  }

  /**
   * Loads data on infinite scroll event. 
   * 
   * @param event the scroll event.
   */
  loadData(event): void {
    this.speciesSub[1] = this._swapiFetchService.genericFetch(this.nextUrl)
      .subscribe(
        (data: object) => {
          this.species = this.species.concat(data['results']);
          this.nextUrl = data['next'];
          event.target.complete();

          if(this.species.length === this.count) {
            event.target.disabled = true;
          }
      });
  }

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
          this.species = this.species.concat(results['results']);

          console.log("Species: ", this.species);
        }
      );
  }

  private unsubscribe(): void {
    for(let i = 0; i < this.speciesSub.length; i++) {
      if(this.speciesSub[i] !== undefined) {
        this.speciesSub[i].unsubscribe();
      }
    }
  }
}
