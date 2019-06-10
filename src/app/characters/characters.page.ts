import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

//RXJS
import { Subscription } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

//Services 
import { SwapiService } from '../services/swapi.service';
import { DataService } from '../services/data.service';

//Models
import { CharacterModel } from '../models/character.model';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.page.html',
  styleUrls: ['./characters.page.scss'],
})
export class CharactersPage implements OnInit, OnDestroy {

  characterSub: Subscription;

  characters: CharacterModel[];
  nextUrl: string;
  count: number;

  constructor(private _swapiFetchService: SwapiService,
              private _dataService: DataService,
              private router: Router) { }

  ngOnInit(): void {
    this.getCharacaters();
  }

  ngOnDestroy(): void {
    if(this.characterSub !== undefined) {
      this.characterSub.unsubscribe();
    }
  } 

  displayCharacter(character: CharacterModel): void {
    console.log("Clicked: ", character);
    this._dataService.setData(character.name, character);
    this.router.navigateByUrl(`/character/${character.name}`);
  }

  loadData(event): void {
    this._swapiFetchService.genericFetch(this.nextUrl)
      .toPromise()
      .then(data => {
        this.characters = this.characters.concat(data['results']);
        this.nextUrl = data['next'];
        event.target.complete();

        if(this.characters.length === this.count) {
          event.target.disabled = true;
        }
      });
  }

  private getCharacaters(): void {
    this.characterSub = this._swapiFetchService.getCharacters()
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

}
