import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
//Models
import { Film }      from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';

//Services
import { StorageService } from 'src/app/services/storage.service';
import { ToastService }   from 'src/app/services/toast.service';
import { SwapiService }   from 'src/app/services/swapi.service';
//RXJS
import { Subscription } from 'rxjs';
//Env 
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss'],
})
export class MoviePageComponent implements OnInit, OnDestroy {

  charSub: Subscription[];

  data: Film;
  characters: Character[];
  dictionary: any

  constructor(private route:    ActivatedRoute, 
              private router:   Router,
              private _storage: StorageService,
              private _toast:   ToastService,
              private _swapiService: SwapiService) { }

  ngOnInit(): void {
    this.charSub = [];
    this.handleData();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private async getCharacters(): Promise<void> {
    this._storage.getCharactersDict().then((characters: any) => {
      console.log("getCharacters(): ", characters);
      if(!characters) {
        console.log("no chars here");
        this.fetchCharacters();
      } else {
        this.dictionary = characters;
        console.log("This.dictionary: ", this.dictionary);
        // parse dictionary into character array, here. 
        this.parseDictionary();

        //Here i need to check that all the characters i need are here, 
        // if not, then i need to grab the missing ones, and cache those in 
        // the dictionary. 
        // TODO - this later. 
      }
    });
  }

  private fetchCharacters(): void {
    this.charSub[0] = this._swapiService.arrayFetch(this.data.characters)
      .subscribe(
        (data: any) => {
          console.log("Character fetch: ", data);
          this.characters = data; 
          
          this.cacheAllCharacters();
        }
      );
  }

  private async cacheAllCharacters(): Promise<void> {
    let chars = {};

    for(let char of this.characters) {
      chars[char.url] = char;
    }
    return this._storage.addCharactersDict(chars);
  }

  private async getMovie(): Promise<void> {
    let id = this.parsePath();

    this._storage.getMovie(id).then((result: any) => {
      if(result) {
        this.data = result;
        
        this.getCharacters();
      } else {//toasts could be a service.
        this._toast.presentToast(environment.notFound).then( 
          (res: any) => {
            this.router.navigateByUrl(`/`);
        });
      }
    });
  }

  private parsePath(): number {
    let idx = this.router.url.lastIndexOf('/');
    let id  = this.router.url.slice(idx + 1);
    return parseInt(id);
  }  

  private handleData(): void {
    if(this.route.snapshot.data['special']) {
      this.data = this.route.snapshot.data['special'];
      this.getCharacters();
    } else {
      this.getMovie();
    }
  }

  /**
   * Parses character dictionary into an array for display.
   */
  private parseDictionary(): void {
    this.characters = [];

    Object.getOwnPropertyNames(this.dictionary).forEach((element) => {
      this.characters.push(this.dictionary[element]);
    });
  }

  /**
   * Unsubs from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.charSub.length; i++) {
      if(this.charSub[i] !== undefined) {
        this.charSub[i].unsubscribe();
      }
    }
  }
}

