import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

//RXJS
import { Subscription } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

//Services 
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';

//Models
import { Character } from '../models/character.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.page.html',
  styleUrls: ['./characters.page.scss'],
})
export class CharactersPage implements OnInit, OnDestroy {
  /** subscriptions */
  characterSub: Subscription[];
  /** Data holding variables. */
  characters: Character[];
  nextUrl: string;
  count: number;

  searchText: string; 
  isSearch: boolean;

  /**
   * ctor
   * @param _swapiFetchService api service layer. 
   * @param _dataService data passing service. 
   * @param router router. 
   */
  constructor(private _swapiFetchService: SwapiService,
              private _dataService: DataService,
              private router: Router) { }
  
  /**
   * lifecycle hook runs when component is being created. 
   * Handles data. 
   */
  ngOnInit(): void {
    this.characterSub = [];
    this.getCharacters();
  }

  /**
   * lifecycle hook runs when component is destroyed. 
   * Unsubs to subs.
   */
  ngOnDestroy(): void {
    this.unsubscribe();
  } 

  search(): void {
    if(this.searchText === "" || this.searchText === undefined) {
      return this.resetSearch();
    }
    this.characterSub[2] = this._swapiFetchService.search(this.searchText, environment.swapiPeople)
      .subscribe((results: any) => {
        this.isSearch = true;
        this.nextUrl = results['next'];
        this.characters = results.results.sort((a: Character, b: Character) => this.sortArr(a.name, b.name));
      });
  }

  resetSearch(): void {
    this.isSearch = false;
    this.getCharacters();
  }

  /**
   * Click function that navigates to movie details page.
   * Passes id, and data to service that gets resolved. 
   * 
   * @param character the character that was clicked. 
   */
  displayCharacter(character: Character): void {
    this._dataService.setData(character.name, character);
    this.router.navigateByUrl(`/character/${character.name}`);
  }

  /**
   * Loads more data on scroll. (infinite scroll functionality).
   * @param event scroll event of reaching bottom of list.
   */
  loadData(event: any): void {
    this.characterSub[1] = this._swapiFetchService.genericFetch(this.nextUrl)
      .subscribe(
        (results: object) => {
          this.characters = this.characters.concat(results['results'])
                                           .sort((a: Character, b: Character) => this.sortArr(a.name, b.name));
          this.nextUrl = results['next'];
          event.target.complete();

          if(this.characters.length === this.count) {
            event.target.disabled = true;
          }
      });
  }

  loadMoreSearch(event: any): void {
    this.characterSub[3] = this._swapiFetchService.genericFetch(this.nextUrl)
      .subscribe((results: object) => {
        this.characters = this.characters.concat(results['results'])
                                         .sort((a: Character, b: Character) => this.sortArr(a.name, b.name));
        this.nextUrl = results['next'];

        event.target.complete();
      });
  }

  /**
   * The initial character fetch, fetches 20 characters. 
   */
  private getCharacters(): void {
    this.characterSub[0] = this._swapiFetchService.getCharacters()
      .pipe(
        map(res => {
          this.nextUrl = res['next'];
          this.characters = res['results'];
        }),
        map(res => this._swapiFetchService.genericFetch(this.nextUrl)),
        flatMap(res => res),
      ).subscribe(
        (results: object) =>
        {
          this.count = results['count'];
          this.nextUrl = results['next'];
          this.characters = this.characters.concat(results['results'])
                                           .sort((a: Character, b: Character) => this.sortArr(a.name, b.name));
        }
      )
  }

  /**
   * Unsubs from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.characterSub.length; i++) {
      if(this.characterSub[i] !== undefined) {
        this.characterSub[i].unsubscribe();
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
}
