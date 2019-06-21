import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
//Models
import { Film }      from 'src/app/models/films.model';
import { Character } from 'src/app/models/character.model';
import { Planet }    from 'src/app/models/planets.model';
import { Species }   from 'src/app/models/species.model';
import { Starship }  from 'src/app/models/starships.model';
import { Vehicle }   from 'src/app/models/vehicles.model';

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

  movieSubs: Subscription[];

  data: Film;
  characters: Character[];
  planets:    Planet[];
  species:    Species[];
  starships:  Starship[];
  vehicles:   Vehicle[];

  charDictionary:      object;
  planetDictionary:    object;
  speciesDictionary:   object;  
  starshipsDictionary: object;
  vehicleDictionary:   object; 

  constructor(private route:    ActivatedRoute, 
              private router:   Router,
              private _storage: StorageService,
              private _toast:   ToastService,
              private _swapiService: SwapiService) { }

  ngOnInit(): void {
    this.movieSubs = [];
    this.handleData();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private async getCharacters(): Promise<void> {
    this._storage.getFullDictionary(environment.CHARS_DICT_KEY).then(
      (characters: any) => {
        if(!characters) {
          console.log("no chars here");
          this.fetchCharacters();
        } else {
          this.charDictionary = characters;
          console.log("This.charDictionary: ", this.charDictionary);
          // parse charDictionary into character array, here. 
          this.characters = this.parseDictionary(this.charDictionary);

          //Here i need to check that all the characters i need are here, 
          // if not, then i need to grab the missing ones, and cache those in 
          // the charDictionary. 
          // TODO - this later. 
        }
    });
  }

  private async getPlanets(): Promise<void> {
    this._storage.getFullDictionary(environment.PLANET_DICT_KEY).then((planets: object) => {
      console.log("planets: ", planets);
      if(!planets) {
        console.log("no planets here: ");
        this.fetchPlanets();
      } else {
        this.planetDictionary = planets;
        console.log("This.planetsDict: ", this.planetDictionary);
        // todo - here same as with characters.... must be a better way.
      
        this.planets = this.parseDictionary(this.planetDictionary);
      }
    });
  }

  private async getSpecies(): Promise<void> {
    this._storage.getFullDictionary(environment.SPECIES_DICT_KEY).then((species: any) => {
      console.log("The species: ", species);
      if(!species) {
        console.log("No species here: ");
        this.fetchSpecies();
      } else {
        this.speciesDictionary = species;
        console.log("This.speciesDict: ", this.speciesDictionary);

        this.species = this.parseDictionary(this.speciesDictionary);
      }
    });
  }

  //gets are from cache. 
  private async getStarships(): Promise<void> {
    this._storage.getFullDictionary(environment.SHIPS_DICT_KEY).then((ships: any) => {
      console.log("The ships: ", ships);
      if(!ships) {
        console.log("No ships here");
        this.fetchStarships();
      } else {
        this.starshipsDictionary = ships;
        console.log("This.shipsDict: ", this.starshipsDictionary);

        this.starships = this.parseDictionary(this.starshipsDictionary);
      }
    });
  }

  private async getVehicles(): Promise<void> {
    this._storage.getFullDictionary(environment.VEHICLE_DICT_KEY).then(
      (vehicles: any) => {
        console.log("the Vehicles: ", vehicles);
        if(!vehicles) {
          console.log("no vehicles here: ");
          this.fetchVehicles();
        } else {
          this.vehicleDictionary = vehicles;
          console.log("Vehicles Dict: ", this.vehicleDictionary);

          this.vehicles = this.parseDictionary(this.vehicleDictionary);
        }
    });
  }

  private fetchVehicles(): void {
    this.movieSubs[4] = this._swapiService.arrayFetch(this.data.vehicles)
      .subscribe((data: any) => {
        console.log("vehicles brah: ", data);
        this.vehicles = data;

        this.cacheAll(this.vehicles, environment.VEHICLE_DICT_KEY);
      });
  }

  //fetches are from api
  private fetchStarships(): void {
    this.movieSubs[3] = this._swapiService.arrayFetch(this.data.starships)
      .subscribe((data: any) => {
        console.log("Starships brah: ", data);
        this.starships = data; 

        this.cacheAll(this.starships, environment.SHIPS_DICT_KEY);
      }); 
  }

  private fetchSpecies(): void {
    this.movieSubs[2] = this._swapiService.arrayFetch(this.data.species)
      .subscribe((data: any) => {
        console.log("Species brah: ", data);
        this.species = data;

        this.cacheAll(this.species, environment.SPECIES_DICT_KEY);
      });
  }

  private fetchPlanets(): void {
    this.movieSubs[1] = this._swapiService.arrayFetch(this.data.planets)  
      .subscribe((data: any) => {
        console.log('planets: ', data);
        this.planets = data;

        this.cacheAll(this.planets, environment.PLANET_DICT_KEY);
      });
  }

  private fetchCharacters(): void {
    this.movieSubs[0] = this._swapiService.arrayFetch(this.data.characters)
      .subscribe((data: any) => {
          console.log("Character fetch: ", data);
          this.characters = data; 
          
          this.cacheAll(this.characters, environment.CHARS_DICT_KEY);
      });
  }

  private async getMovie(): Promise<void> {
    let id = this.parsePath();

    this._storage.getMovie(id).then((result: any) => {
      if(result) {
        this.data = result;
        
        this.getExtraData();
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
      this.getExtraData();
    } else {
      this.getMovie();
    }
  }

  private getExtraData(): void {
      this.getCharacters();
      this.getPlanets();
      this.getSpecies();
      this.getStarships();
      this.getVehicles();
  }

  /**
   * Parses character dictionary into an array for display.
   */
  private parseDictionary(dictionary: object): any[] {
    let array = [];

    Object.getOwnPropertyNames(dictionary).forEach((element) => {
      array.push(dictionary[element]);
    });

    return array;
  }

  private async cacheAll(array: any[], key: string): Promise<void> {
    let obj = {};

    for(let item of array) {
      obj[item.url] = item;
    }
    return this._storage.addFullDictionary(obj, key);
  }

  /**
   * Unsubs from subs.
   */
  private unsubscribe(): void {
    for(let i = 0; i < this.movieSubs.length; i++) {
      if(this.movieSubs[i] !== undefined) {
        this.movieSubs[i].unsubscribe();
      }
    }
  }
}

