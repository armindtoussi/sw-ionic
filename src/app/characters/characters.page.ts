import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

//RXJS
import { Subscription } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

//Services 
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';

//Models
import { CharacterModel, Character } from '../models/character.model';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.page.html',
  styleUrls: ['./characters.page.scss'],
})
export class CharactersPage implements OnInit, OnDestroy {

  characterSub: Subscription[] = [];

  characters: Character[];
  nextUrl: string;
  count: number;

  constructor(private _swapiFetchService: SwapiService,
              private _dataService: DataService,
              private router: Router) { }

  ngOnInit(): void {
    this.getCharacaters();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  } 

  displayCharacter(character: Character): void {
    console.log("Clicked: ", character);
    this._dataService.setData(character.name, character);
    this.router.navigateByUrl(`/character/${character.name}`);
  }

  loadData(event): void {
    this.characterSub[1] = this._swapiFetchService.genericFetch(this.nextUrl)
      .subscribe(
        (results: object) => {
          this.characters = this.characters.concat(results['results']);
          this.nextUrl = results['next'];
          event.target.complete();

          if(this.characters.length === this.count) {
            event.target.disabled = true;
          }
      });
  }

  private getCharacaters(): void {
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
          this.characters = this.characters.concat(results['results']);

          console.log("Characters: ", this.characters);
        }
      )
  }

  private unsubscribe(): void {
    for(let i = 0; i < this.characterSub.length; i++) {
      if(this.characterSub[i] !== undefined) {
        this.characterSub[i].unsubscribe();
      }
    }
  }
}
