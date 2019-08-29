// Ng
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// RXJS
import { Subscription } from 'rxjs';
// Services
import { CharacterService } from './character.service';
import { DataService } from '../services/data.service';
// Models
import { Character } from '../models/character.model';

/**
 * Character Page.
 *
 * This page holds an exmaple of how to do Observables with
 * subscription array, and handles manual unsubscription using
 * a for-each loop through the subscription array.
 *
 * TODO - add error handling, using the bookmark we saved on chrome as
 *        inspiration so-to-speak. when i do error handling, i should
 *        also do UI feedback on waiting for response.
 *        Can maybe use ng-container element in conjunction with ngIf
 *        in order to implement ui state feedback.
 */
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
  /** The search text from ion-input box. */
  searchText: string;
  /** State boolean recognizing an in progress search. */
  isSearch: boolean;

  /**
   * ctor
   * @param charService character module service.
   * @param dataService data passing service.
   * @param router router.
   */
  constructor(private charService: CharacterService,
              private dataService: DataService,
              private router: Router) { }

  /**
   * lifecycle hook runs when component is being created.
   * Handles data fetch.
   */
  ngOnInit(): void {
    this.characterSub = [];
    this.getCharacters();
  }

  /**
   * lifecycle hook runs when component is destroyed.
   * Unsubs to subsriptions.
   */
  ngOnDestroy(): void {
    this.unsubscribe();
  }

  /**
   * Click function that navigates to movie details page.
   * Passes id, and data to service that gets resolved.
   *
   * @param character the character that was clicked.
   */
  displayCharacter(character: Character): void {
    this.dataService.setData(character.name, character);
    this.router.navigateByUrl(`/character/${character.name}`);
  }

  /**
   * The initial character fetch, fetches 20 characters.
   */
  public getCharacters(): void {
    this.characterSub[0] = this.charService.getCharacters()
      .subscribe(
        (results: Character[]) => {
          this.characters = results;
      });
  }

  /**
   * Loads more data on scroll. (infinite scroll functionality).
   * @param event scroll event of reaching bottom of list.
   */
  loadData(event: any): void {
    this.characterSub[1] = this.charService.loadMore()
      .subscribe(
        (result: Character[]) => {
          this.characters = result;

          if (event !== null) {
            event.target.complete();
          }

          if (this.characters.length === this.charService.getCount()) {
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

    this.characterSub[2] = this.charService.search(this.searchText)
      .subscribe((results: Character[]) => {
        this.isSearch = true;
        this.characters = results;
      });
  }

  /**
   * Reset search function sets search to false and
   * fetches regular data list.
   */
  resetSearch(): void {
    this.isSearch = false;
    this.getCharacters();
  }

  /**
   * UI/UX boolean to control ion-infinite scroll.
   * Fetches from character Service.
   */
  getHasNext(): boolean {
    if (this.charService.hasNext() === null) {
      return false;
    }
    return true;
  }

  /**
   * Unsubs from subscriptions using forEach.
   */
  public unsubscribe(): void {
    this.characterSub.forEach((sub: Subscription) => {
      if (sub !== undefined) {
        sub.unsubscribe();
      }
    });
  }
}
